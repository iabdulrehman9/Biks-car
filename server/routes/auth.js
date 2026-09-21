const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const inputIdentifier = (email || username || '').toLowerCase().trim();

    if (!inputIdentifier || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Try finding by email
    let rows = await db.query('SELECT * FROM `admins` WHERE LOWER(email) = ? LIMIT 1', [inputIdentifier]);
    let admin = rows[0];

    // Fallback: If input is 'admin' or matches old username, find the single admin in DB
    if (!admin && inputIdentifier === 'admin') {
      const fallbackRows = await db.query('SELECT * FROM `admins` LIMIT 1');
      admin = fallbackRows[0];
    }

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify hashed password with bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT with extended 30-day lifespan
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'biks_jwt_secret_key_2024_trading_company',
      { expiresIn: '30d' }
    );

    res.json({ token, email: admin.email, role: admin.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/profile — Get current admin profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const rows = await db.query('SELECT id, email, role FROM `admins` WHERE id = ? LIMIT 1', [req.user.id]);
    const admin = rows[0];
    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found.' });
    }
    res.json({ email: admin.email });
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    res.status(500).json({ error: 'Failed to fetch admin profile.' });
  }
});

// PUT /api/auth/profile — Directly update admin email and/or password
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    const rows = await db.query('SELECT * FROM `admins` WHERE id = ? LIMIT 1', [req.user.id]);
    const admin = rows[0];
    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found.' });
    }

    let updatedEmail = admin.email;
    let updatedPassword = admin.password;

    // If new email is provided
    if (email && email.trim()) {
      const normalizedEmail = email.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }

      // Check if already used by another account
      const existing = await db.query(
        'SELECT id FROM `admins` WHERE LOWER(email) = ? AND id != ? LIMIT 1',
        [normalizedEmail, admin.id]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'This email is already in use.' });
      }

      updatedEmail = normalizedEmail;
    }

    // If new password is provided
    if (password && password.trim()) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      }
      updatedPassword = await bcrypt.hash(password, 10);
    }

    await db.query(
      'UPDATE `admins` SET email = ?, password = ? WHERE id = ?',
      [updatedEmail, updatedPassword, admin.id]
    );

    // Re-issue a fresh JWT with updated email (30d)
    const token = jwt.sign(
      { id: admin.id, email: updatedEmail, role: admin.role },
      process.env.JWT_SECRET || 'biks_jwt_secret_key_2024_trading_company',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Credentials updated successfully.',
      email: updatedEmail,
      token,
    });
  } catch (err) {
    console.error('Error updating admin profile:', err);
    res.status(500).json({ error: 'Failed to update credentials.' });
  }
});

// POST /api/auth/refresh — Refresh an expiring or recently expired token
router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let token = req.body.token;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'No token provided for refresh.' });
    }

    // Decode even if expired
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'biks_jwt_secret_key_2024_trading_company', { ignoreExpiration: true });
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token signature.' });
    }

    // Disallow refreshing tokens expired for more than 14 days
    const nowInSec = Math.floor(Date.now() / 1000);
    if (decoded.exp && (nowInSec - decoded.exp > 14 * 24 * 3600)) {
      return res.status(401).json({ error: 'Token expired too long ago. Please log in again.' });
    }

    // Verify admin still exists in DB
    const rows = await db.query('SELECT id, email, role FROM `admins` WHERE id = ? LIMIT 1', [decoded.id]);
    const admin = rows[0];
    if (!admin) {
      return res.status(401).json({ error: 'Admin account no longer exists.' });
    }

    const freshToken = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'biks_jwt_secret_key_2024_trading_company',
      { expiresIn: '30d' }
    );

    res.json({
      token: freshToken,
      email: admin.email,
      role: admin.role,
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ error: 'Failed to refresh token.' });
  }
});

// GET /api/auth/verify — Verify token
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
