require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Vehicle = require('./models/Vehicle');

async function seed() {
  try {
    // Read the exported Supabase data
    const dataPath = path.join(__dirname, '..', 'supabase_data.json');
    if (!fs.existsSync(dataPath)) {
      console.log('No supabase_data.json found. Skipping seed.');
      process.exit(0);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const vehicles = JSON.parse(rawData);

    if (vehicles.length === 0) {
      console.log('No vehicles to seed.');
      process.exit(0);
    }

    console.log(`Found ${vehicles.length} vehicles to import.`);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear existing vehicles (optional, prevents duplicates on re-run)
    const existingCount = await Vehicle.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing vehicles. Clearing before seed...`);
      await Vehicle.deleteMany({});
    }

    // Transform Supabase data - remove the uuid `id` field since MongoDB will generate _id
    const vehicleDocs = vehicles.map(v => {
      const { id, ...rest } = v;
      return {
        ...rest,
        // Preserve original timestamps
        created_at: v.created_at ? new Date(v.created_at) : new Date(),
        updated_at: v.updated_at ? new Date(v.updated_at) : new Date(),
      };
    });

    // Insert all vehicles
    const result = await Vehicle.insertMany(vehicleDocs);
    console.log(`✅ Successfully imported ${result.length} vehicles into MongoDB.`);

    // Print a summary
    result.forEach(v => {
      console.log(`  - ${v.year} ${v.make} ${v.model} (${v.stock_id || 'no stock ID'}) → ID: ${v._id}`);
    });

    await mongoose.connection.close();
    console.log('Done. MongoDB connection closed.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
