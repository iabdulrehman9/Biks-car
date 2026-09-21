const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP and GIF images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit per image
});

async function processAndSaveImage(fileBuffer, prefix = 'sell') {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${prefix}-${uniqueSuffix}.webp`;
  const destPath = path.join(uploadsDir, filename);

  await sharp(fileBuffer)
    .rotate()
    .resize({
      width: 1600,
      height: 1200,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toFile(destPath);

  return filename;
}

function getFileUrl(req, filename) {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  const host = req.get('host') || 'localhost:5000';
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  return `${protocol}://${host}/uploads/${filename}`;
}

// ============================================================================
// PUBLIC: Submit a new Sell Request
// POST /api/sell-requests
// ============================================================================
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const {
      customer_name,
      email,
      phone,
      address,
      category,
      description,
    } = req.body;

    // Validation
    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ error: 'Address / location is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Process optional uploaded images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const filename = await processAndSaveImage(file.buffer, 'sell');
          imageUrls.push(getFileUrl(req, filename));
        } catch (imgErr) {
          console.warn('Image processing warning:', imgErr.message);
        }
      }
    }

    const id = db.generateId();
    await db.query(
      `INSERT INTO \`sell_requests\`
        (id, customer_name, email, phone, address, category, description, images, status, admin_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NULL)`,
      [
        id,
        customer_name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        address.trim(),
        category ? category.trim() : null,
        description.trim(),
        JSON.stringify(imageUrls),
      ]
    );

    const rows = await db.query('SELECT * FROM `sell_requests` WHERE id = ?', [id]);
    const created = db.formatSellRequest(rows[0]);

    return res.status(201).json({
      message: 'Your request has been submitted successfully! Our team will contact you shortly.',
      request: created,
    });
  } catch (error) {
    console.error('Error submitting sell request:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit sell request' });
  }
});

// ============================================================================
// ADMIN: Fetch all Sell Requests (Protected)
// GET /api/sell-requests
// ============================================================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM `sell_requests`';
    const params = [];

    if (status && status !== 'all') {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await db.query(sql, params);
    const requests = rows.map(db.formatSellRequest);
    return res.json(requests);
  } catch (error) {
    console.error('Error fetching sell requests:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch sell requests' });
  }
});

// ============================================================================
// ADMIN: Update Sell Request status / admin notes (Protected)
// PATCH /api/sell-requests/:id
// ============================================================================
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const existing = await db.query('SELECT * FROM `sell_requests` WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ error: 'Sell request not found' });
    }

    const updates = [];
    const params = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(admin_notes);
    }

    if (updates.length > 0) {
      params.push(id);
      await db.query(`UPDATE \`sell_requests\` SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const updated = await db.query('SELECT * FROM `sell_requests` WHERE id = ?', [id]);
    return res.json(db.formatSellRequest(updated[0]));
  } catch (error) {
    console.error('Error updating sell request:', error);
    return res.status(500).json({ error: error.message || 'Failed to update sell request' });
  }
});

// ============================================================================
// ADMIN: Delete Sell Request (Protected)
// DELETE /api/sell-requests/:id
// ============================================================================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM `sell_requests` WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sell request not found' });
    }
    return res.json({ message: 'Sell request deleted successfully' });
  } catch (error) {
    console.error('Error deleting sell request:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete sell request' });
  }
});

module.exports = router;
