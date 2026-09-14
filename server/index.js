const path = require('path');
const fs = require('fs');
const dns = require('dns');

// Ensure reliable SRV lookup across platforms and ISPs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const { router: categoryRoutes, seedDefaultCategories } = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// Middleware
// ============================================================================

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://biks.online',
    'https://www.biks.online',
    'https://api.biks.online',
  ],
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// Database Connection & Server Start
// ============================================================================

let isMongoConnected = false;

async function connectMongoDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas');

    // Ensure default categories are seeded
    await seedDefaultCategories();
  } catch (err) {
    isMongoConnected = false;
    console.warn('⚠️ MongoDB connection warning:', err.message);
    console.warn('   If IP whitelist issue: add current IP (or 0.0.0.0/0) in MongoDB Atlas Network Access.');
    console.warn('   Retrying connection in 15 seconds...');
    setTimeout(connectMongoDB, 15000);
  }
}

app.listen(PORT, () => {
  console.log(`✅ BIKS Server running on http://localhost:${PORT}`);
  console.log(`   API:     http://localhost:${PORT}/api`);
  console.log(`   Uploads: http://localhost:${PORT}/uploads`);
  connectMongoDB();
});
