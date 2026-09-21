require('dotenv').config();
const db = require('./db');

async function runSeed() {
  try {
    console.log('Running manual database seed for MySQL...');
    await db.initDatabase();
    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

runSeed();
