const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// ============================================================================
// MySQL Connection Pool Configuration
// ============================================================================

let pool = null;
let isConnected = false;

function getPool() {
  if (!pool) {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'biks_trading',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      charset: 'utf8mb4',
    };

    // If a full connection URL is provided (e.g. mysql://user:pass@host:port/db)
    if (process.env.DATABASE_URL || process.env.MYSQL_URI) {
      pool = mysql.createPool(process.env.DATABASE_URL || process.env.MYSQL_URI);
    } else {
      pool = mysql.createPool(config);
    }
  }
  return pool;
}

// Generic query helper
async function query(sql, params = []) {
  const p = getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
}

// Generate a random 24-character hex ID (compatible with MongoDB/ObjectId string format)
function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// Helper: format vehicle row from MySQL into the exact object expected by the frontend
function normalizeImageUrl(url, host) {
  if (!url) return null;
  if (url.includes('hostingersite.com') || url.includes('onrender.com') || url.includes('localhost:5000')) {
    const targetHost = host ? (host.startsWith('localhost') ? `http://${host}` : `https://${host}`) : 'https://api.biks.online';
    return url.replace(/https?:\/\/[^/]+/, targetHost);
  }
  return url;
}

// Helper: format vehicle row from MySQL
function formatVehicle(row, host) {
  if (!row) return null;

  let gallery = [];
  if (Array.isArray(row.gallery)) {
    gallery = row.gallery;
  } else if (typeof row.gallery === 'string') {
    try {
      gallery = JSON.parse(row.gallery);
    } catch {
      gallery = row.gallery ? row.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];
    }
  }

  let features = [];
  if (Array.isArray(row.features)) {
    features = row.features;
  } else if (typeof row.features === 'string') {
    try {
      features = JSON.parse(row.features);
    } catch {
      features = row.features ? row.features.split(',').map(s => s.trim()).filter(Boolean) : [];
    }
  }

  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year ? Number(row.year) : null,
    category: row.category || null,
    body_type: row.body_type || null,
    transmission: row.transmission || null,
    fuel_type: row.fuel_type || null,
    engine_cc: row.engine_cc ? Number(row.engine_cc) : null,
    mileage_km: row.mileage_km ? Number(row.mileage_km) : null,
    color: row.color || null,
    price_fob_jpy: row.price_fob_jpy ? Number(row.price_fob_jpy) : null,
    price_fob_usd: row.price_fob_usd ? Number(row.price_fob_usd) : null,
    status: row.status || 'Available',
    location: row.location || null,
    image_url: normalizeImageUrl(row.image_url, host),
    gallery: gallery.map(u => normalizeImageUrl(u, host)).filter(Boolean),
    features,
    featured: Boolean(row.featured),
    description: row.description || null,
    chassis_no: row.chassis_no || null,
    stock_id: row.stock_id || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Helper: format sell_request row from MySQL
function formatSellRequest(row) {
  if (!row) return null;
  let images = [];
  if (Array.isArray(row.images)) {
    images = row.images;
  } else if (typeof row.images === 'string') {
    try {
      images = JSON.parse(row.images);
    } catch {
      images = row.images ? row.images.split(',').map(s => s.trim()).filter(Boolean) : [];
    }
  }
  return {
    id: row.id,
    customer_name: row.customer_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    category: row.category || null,
    description: row.description,
    images,
    status: row.status || 'Pending',
    admin_notes: row.admin_notes || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// ============================================================================
// Automatic Table Creation & Data Seeding
// ============================================================================

const DEFAULT_CATEGORIES = [
  'Trucks',
  'Excavators',
  'Tyre Shover',
  'Forklifts',
  'Agriculture Machines',
  'Truck Fixtures',
  'Cars',
  'Other Parts',
];

const INITIAL_VEHICLES = [
  {
    id: '6aa85c72cce13a07f4a62f15',
    make: 'Toyota',
    model: 'Land Cruiser Prado TX L-Package',
    year: 2021,
    category: 'Cars',
    body_type: 'SUV',
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    engine_cc: 2755,
    mileage_km: 38500,
    color: 'Pearl White',
    price_fob_jpy: 4850000,
    price_fob_usd: 32500,
    status: 'Available',
    location: 'Yokohama Port, Japan',
    image_url: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Sunroof', 'Leather Seats', '4WD', 'Pre-Crash Safety System', '360 Camera', 'Roof Rails'],
    featured: 1,
    description: 'Pristine condition 2021 Toyota Land Cruiser Prado TX L-Package. Fully verified at auction.',
    chassis_no: 'GDJ150-0089241',
    stock_id: 'BIKS-2101',
  },
  {
    id: '6aa85c73cce13a07f4a62f18',
    make: 'Isuzu',
    model: 'Giga 10-Wheeler Dump Truck',
    year: 2019,
    category: 'Trucks',
    body_type: 'Truck',
    transmission: 'Manual',
    fuel_type: 'Diesel',
    engine_cc: 9839,
    mileage_km: 184000,
    color: 'Ocean Blue',
    price_fob_jpy: 6200000,
    price_fob_usd: 41800,
    status: 'Available',
    location: 'Kobe Port, Japan',
    image_url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['10-Wheeler Heavy Duty', 'Hydraulic Lift', 'Air Brakes', 'Power Steering', 'Air Conditioner'],
    featured: 1,
    description: 'Heavy duty Isuzu Giga 10-wheeler dump truck ready for immediate export shipment.',
    chassis_no: 'CXZ77Y-7001423',
    stock_id: 'BIKS-1902',
  },
  {
    id: '6aa85c75cce13a07f4a62f1d',
    make: 'Komatsu',
    model: 'WA200-8 Wheel Loader',
    year: 2020,
    category: 'Tyre Shover',
    body_type: 'Truck',
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    engine_cc: 4460,
    mileage_km: 4200,
    color: 'Komatsu Yellow',
    price_fob_jpy: 7800000,
    price_fob_usd: 52000,
    status: 'Available',
    location: 'Nagoya Port, Japan',
    image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Standard 2.0m3 Bucket', 'EPA Tier 4 Final Engine', 'ROPS/FOPS Enclosed Cabin', 'Hydrostatic Transmission'],
    featured: 1,
    description: 'Top condition Komatsu WA200-8 wheel loader with low operating hours. Inspected and ready to ship.',
    chassis_no: 'WA200-80412',
    stock_id: 'BIKS-2003',
  },
  {
    id: '6aa85c86cce13a07f4a62f26',
    make: 'Mitsubishi Fuso',
    model: 'Super Great Tractor Head',
    year: 2018,
    category: 'Truck Fixtures',
    body_type: 'Truck',
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    engine_cc: 10676,
    mileage_km: 295000,
    color: 'Silver Metallic',
    price_fob_jpy: 5600000,
    price_fob_usd: 37500,
    status: 'Available',
    location: 'Yokohama Port, Japan',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['High-Roof Sleeper Cabin', 'ShiftPilot Automated Manual', 'Air Suspension', 'Fifth Wheel Coupling'],
    featured: 1,
    description: 'Prime Mitsubishi Fuso Super Great tractor head for long-haul cargo and container transport.',
    chassis_no: 'FP54VDR-520119',
    stock_id: 'BIKS-1806',
  },
  {
    id: '6aa85c75cce13a07f4a62f20',
    make: 'Toyota',
    model: '8FG25 2.5-Ton Counterbalance',
    year: 2022,
    category: 'Forklifts',
    body_type: 'Van',
    transmission: 'Automatic',
    fuel_type: 'Gasoline',
    engine_cc: 2237,
    mileage_km: 1650,
    color: 'Orange / Gray',
    price_fob_jpy: 2450000,
    price_fob_usd: 16500,
    status: 'Reserved',
    location: 'Yokohama Port, Japan',
    image_url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['2.5-Ton Capacity', '3-Stage 4.5m Mast', 'Side Shift Attachment', 'Solid Pneumatic Tyres'],
    featured: 0,
    description: 'Toyota 8FG25 2.5-ton gasoline/LPG forklift with side shifter. Excellent warehouse reliability.',
    chassis_no: '8FG25-61849',
    stock_id: 'BIKS-2204',
  },
  {
    id: '6aa85c77cce13a07f4a62f23',
    make: 'Kubota',
    model: 'M7040 4WD Agricultural Tractor',
    year: 2019,
    category: 'Agricultural Machines',
    body_type: 'Truck',
    transmission: 'Manual',
    fuel_type: 'Diesel',
    engine_cc: 3331,
    mileage_km: 2100,
    color: 'Kubota Orange',
    price_fob_jpy: 3400000,
    price_fob_usd: 22800,
    status: 'Available',
    location: 'Osaka Port, Japan',
    image_url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['71 HP Turbo Diesel', 'Hydraulic Shuttle', 'Independent 540 RPM PTO', '3-Point Category II Hitch'],
    featured: 0,
    description: 'Reliable Kubota M7040 utility agricultural tractor with 4WD, ready for farm operations.',
    chassis_no: 'M7040D-51093',
    stock_id: 'BIKS-1905',
  },
  {
    id: '6a9073b49dff4fedf9dc038c',
    make: 'Hino',
    model: 'Profia',
    year: 2015,
    category: 'Trucks',
    body_type: 'Truck',
    transmission: 'Manual',
    fuel_type: 'Diesel',
    engine_cc: 12913,
    mileage_km: 340000,
    color: 'White',
    price_fob_jpy: 3900000,
    price_fob_usd: 26000,
    status: 'Sold',
    location: 'Nagoya Port, Japan',
    image_url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['High Deck Cargo Bed', 'Retarder', 'Air Suspended Driver Seat', 'Bed in Cabin'],
    featured: 0,
    description: 'Hino Profia long chassis cargo truck. Successfully sold and shipped.',
    chassis_no: 'FW1EXBG-10823',
    stock_id: 'BIKS-1507',
  },
];

async function initDatabase() {
  try {
    console.log('Connecting to MySQL database...');
    const p = getPool();
    const conn = await p.getConnection();
    console.log('✅ Connected to MySQL database');
    conn.release();

    // 1. Create admins table
    await query(`
      CREATE TABLE IF NOT EXISTS \`admins\` (
        \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
        \`email\` VARCHAR(150) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`role\` VARCHAR(50) NOT NULL DEFAULT 'admin',
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Create categories table
    await query(`
      CREATE TABLE IF NOT EXISTS \`categories\` (
        \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(100) NOT NULL UNIQUE,
        \`slug\` VARCHAR(100) NOT NULL UNIQUE,
        \`display_order\` INT NOT NULL DEFAULT 0,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Create vehicles table
    await query(`
      CREATE TABLE IF NOT EXISTS \`vehicles\` (
        \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
        \`make\` VARCHAR(100) NOT NULL,
        \`model\` VARCHAR(100) NOT NULL,
        \`year\` INT NOT NULL,
        \`category\` VARCHAR(100) DEFAULT NULL,
        \`body_type\` VARCHAR(50) DEFAULT NULL,
        \`transmission\` VARCHAR(50) DEFAULT NULL,
        \`fuel_type\` VARCHAR(50) DEFAULT NULL,
        \`engine_cc\` INT DEFAULT NULL,
        \`mileage_km\` INT DEFAULT NULL,
        \`color\` VARCHAR(50) DEFAULT NULL,
        \`price_fob_jpy\` BIGINT DEFAULT NULL,
        \`price_fob_usd\` DECIMAL(12, 2) DEFAULT NULL,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'Available',
        \`location\` VARCHAR(150) DEFAULT NULL,
        \`image_url\` TEXT DEFAULT NULL,
        \`gallery\` LONGTEXT DEFAULT NULL,
        \`features\` LONGTEXT DEFAULT NULL,
        \`featured\` TINYINT(1) NOT NULL DEFAULT 0,
        \`description\` TEXT DEFAULT NULL,
        \`chassis_no\` VARCHAR(100) DEFAULT NULL,
        \`stock_id\` VARCHAR(100) DEFAULT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_category\` (\`category\`),
        INDEX \`idx_featured\` (\`featured\`),
        INDEX \`idx_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Create sell_requests table
    await query(`
      CREATE TABLE IF NOT EXISTS \`sell_requests\` (
        \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
        \`customer_name\` VARCHAR(150) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL,
        \`phone\` VARCHAR(50) NOT NULL,
        \`address\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) DEFAULT NULL,
        \`description\` TEXT NOT NULL,
        \`images\` LONGTEXT DEFAULT NULL,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'Pending',
        \`admin_notes\` TEXT DEFAULT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_sell_status\` (\`status\`),
        INDEX \`idx_sell_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Seed default admin if empty
    const adminRows = await query('SELECT COUNT(*) AS cnt FROM `admins`');
    if (adminRows[0].cnt === 0) {
      const defaultEmail = (process.env.ADMIN_EMAIL || 'biksss@gmail.com').toLowerCase().trim();
      const defaultPassword = process.env.ADMIN_PASSWORD || 'biks2024';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await query(
        'INSERT INTO `admins` (id, email, password, role) VALUES (?, ?, ?, ?)',
        [generateId(), defaultEmail, hashedPassword, 'admin']
      );
      console.log(`✅ Default admin seeded in MySQL: ${defaultEmail}`);
    }

    // 5. Seed default categories if empty
    const catRows = await query('SELECT COUNT(*) AS cnt FROM `categories`');
    if (catRows[0].cnt === 0) {
      for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
        const name = DEFAULT_CATEGORIES[i];
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await query(
          'INSERT INTO `categories` (id, name, slug, display_order) VALUES (?, ?, ?, ?)',
          [generateId(), name, slug, i + 1]
        );
      }
      console.log('✅ Default categories seeded in MySQL');
    }

    // 6. Seed initial vehicles if empty
    const vehRows = await query('SELECT COUNT(*) AS cnt FROM `vehicles`');
    if (vehRows[0].cnt === 0) {
      for (const v of INITIAL_VEHICLES) {
        await query(
          `INSERT INTO \`vehicles\` (
            id, make, model, year, category, body_type, transmission, fuel_type,
            engine_cc, mileage_km, color, price_fob_jpy, price_fob_usd, status,
            location, image_url, gallery, features, featured, description, chassis_no, stock_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            v.id,
            v.make,
            v.model,
            v.year,
            v.category,
            v.body_type,
            v.transmission,
            v.fuel_type,
            v.engine_cc,
            v.mileage_km,
            v.color,
            v.price_fob_jpy,
            v.price_fob_usd,
            v.status,
            v.location,
            v.image_url,
            JSON.stringify(v.gallery),
            JSON.stringify(v.features),
            v.featured,
            v.description,
            v.chassis_no,
            v.stock_id,
          ]
        );
      }
      console.log('✅ Default vehicles seeded in MySQL');
    }

    isConnected = true;
  } catch (err) {
    isConnected = false;
    console.warn('⚠️ MySQL connection warning:', err.message);
    console.warn('   Ensure Hostinger MySQL credentials in .env are correct (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).');
    console.warn('   Retrying connection in 15 seconds...');
    setTimeout(initDatabase, 15000);
  }
}

module.exports = {
  getPool,
  query,
  generateId,
  formatVehicle,
  formatSellRequest,
  initDatabase,
  DEFAULT_CATEGORIES,
};
