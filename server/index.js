require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');

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

// Serve uploaded images statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ============================================================================
// Routes
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// Database Connection & Server Start
// ============================================================================

async function start() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`✅ BIKS Server running on http://localhost:${PORT}`);
      console.log(`   API:     http://localhost:${PORT}/api`);
      console.log(`   Uploads: http://localhost:${PORT}/uploads`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
