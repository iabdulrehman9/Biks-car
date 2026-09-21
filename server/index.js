const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const db = require('./db');

const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const { router: categoryRoutes } = require('./routes/categories');
const sellRequestRoutes = require('./routes/sellRequests');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// Middleware
// ============================================================================

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);
    if (
      origin.includes('localhost') ||
      origin.includes('biks.online') ||
      origin.includes('hostingersite.com') ||
      origin.includes('onrender.com')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically with 30-day immutable caching
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '30d',
  immutable: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
  },
}));

// ============================================================================
// Routes
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sell-requests', sellRequestRoutes);

// Health check and root ping endpoints (for Hostinger, Render, UptimeRobot)
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'BIKS Trading Company API Server is running',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// Server Start & MySQL Database Initialization
// ============================================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ BIKS Server running on http://0.0.0.0:${PORT}`);
  console.log(`   API:     http://0.0.0.0:${PORT}/api`);
  console.log(`   Uploads: http://0.0.0.0:${PORT}/uploads`);
  db.initDatabase();
});
