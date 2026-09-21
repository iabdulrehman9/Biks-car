const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ============================================================================
// Multer Configuration with Sharp WebP Processing
// ============================================================================

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory storage for fast streaming into Sharp
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP and GIF images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB upload limit, compressed down to ~150KB
});

/**
 * Optimizes an uploaded buffer to high-efficiency WebP format.
 */
async function processAndSaveImage(fileBuffer, prefix = 'vehicle') {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${prefix}-${uniqueSuffix}.webp`;
  const destPath = path.join(uploadsDir, filename);

  await sharp(fileBuffer)
    .rotate() // Automatically orient based on EXIF
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

// Helper: build full URL for an uploaded file
function getImageUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

// Helper: delete a file from uploads if it's a local file
function deleteLocalFile(imageUrl) {
  if (!imageUrl) return;
  try {
    if (imageUrl.includes('/uploads/')) {
      const filename = imageUrl.split('/uploads/').pop();
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    console.error('Error deleting file:', err.message);
  }
}

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// GET /api/vehicles — List all vehicles
router.get('/', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM `vehicles` ORDER BY `created_at` DESC');
    res.json(rows.map(r => db.formatVehicle(r, req.get('host'))));
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
});

// GET /api/vehicles/:id — Get single vehicle
router.get('/:id', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM `vehicles` WHERE id = ? LIMIT 1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    res.json(db.formatVehicle(rows[0], req.get('host')));
  } catch (err) {
    console.error('Error fetching vehicle:', err);
    res.status(500).json({ error: 'Failed to fetch vehicle.' });
  }
});

// ============================================================================
// PROTECTED ROUTES (Admin Only)
// ============================================================================

// POST /api/vehicles — Create new vehicle
router.post('/',
  authMiddleware,
  upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const vehicleData = { ...req.body };

      // Parse arrays and booleans from form data
      let features = [];
      if (typeof vehicleData.features === 'string') {
        try {
          features = JSON.parse(vehicleData.features);
        } catch {
          features = vehicleData.features.split(',').map(f => f.trim()).filter(Boolean);
        }
      } else if (Array.isArray(vehicleData.features)) {
        features = vehicleData.features;
      }

      let gallery = [];
      if (typeof vehicleData.gallery === 'string') {
        try {
          gallery = JSON.parse(vehicleData.gallery);
        } catch {
          gallery = vehicleData.gallery.split(',').map(u => u.trim()).filter(Boolean);
        }
      } else if (Array.isArray(vehicleData.gallery)) {
        gallery = vehicleData.gallery;
      }

      const featured = (vehicleData.featured === true || vehicleData.featured === 'true' || vehicleData.featured === 1 || vehicleData.featured === '1') ? 1 : 0;

      // Parse numbers
      const year = vehicleData.year ? parseInt(vehicleData.year, 10) : new Date().getFullYear();
      const engine_cc = vehicleData.engine_cc ? parseInt(vehicleData.engine_cc, 10) : null;
      const mileage_km = vehicleData.mileage_km ? parseInt(vehicleData.mileage_km, 10) : null;
      const price_fob_jpy = vehicleData.price_fob_jpy ? parseInt(vehicleData.price_fob_jpy, 10) : null;
      const price_fob_usd = vehicleData.price_fob_usd ? parseFloat(vehicleData.price_fob_usd) : null;

      let imageUrl = vehicleData.image_url || null;

      // Handle uploaded main image (compressed to WebP)
      if (req.files && req.files.main_image && req.files.main_image[0]) {
        const filename = await processAndSaveImage(req.files.main_image[0].buffer, 'vehicle-main');
        imageUrl = getImageUrl(req, filename);
      }

      // Handle uploaded gallery images (compressed to WebP)
      if (req.files && req.files.gallery_images && req.files.gallery_images.length > 0) {
        const galleryFilenames = await Promise.all(
          req.files.gallery_images.map(f => processAndSaveImage(f.buffer, 'vehicle-gallery'))
        );
        const uploadedGallery = galleryFilenames.map(fn => getImageUrl(req, fn));
        gallery = [...gallery, ...uploadedGallery];
      }

      // If gallery is empty but we have main image, add main to gallery
      if (gallery.length === 0 && imageUrl) {
        gallery = [imageUrl];
      }

      const id = db.generateId();

      await db.query(
        `INSERT INTO \`vehicles\` (
          id, make, model, year, category, body_type, transmission, fuel_type,
          engine_cc, mileage_km, color, price_fob_jpy, price_fob_usd, status,
          location, image_url, gallery, features, featured, description, chassis_no, stock_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          vehicleData.make || 'Unknown Make',
          vehicleData.model || 'Unknown Model',
          year,
          vehicleData.category || null,
          vehicleData.body_type || null,
          vehicleData.transmission || null,
          vehicleData.fuel_type || null,
          engine_cc,
          mileage_km,
          vehicleData.color || null,
          price_fob_jpy,
          price_fob_usd,
          vehicleData.status || 'Available',
          vehicleData.location || null,
          imageUrl,
          JSON.stringify(gallery),
          JSON.stringify(features),
          featured,
          vehicleData.description || null,
          vehicleData.chassis_no || null,
          vehicleData.stock_id || null,
        ]
      );

      const rows = await db.query('SELECT * FROM `vehicles` WHERE id = ? LIMIT 1', [id]);
      res.status(201).json(db.formatVehicle(rows[0], req.get('host')));
    } catch (err) {
      console.error('Error creating vehicle:', err);
      res.status(500).json({ error: 'Failed to create vehicle.', details: err.message });
    }
  }
);

// PUT /api/vehicles/:id — Update vehicle
router.put('/:id',
  authMiddleware,
  upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const existingRows = await db.query('SELECT * FROM `vehicles` WHERE id = ? LIMIT 1', [req.params.id]);
      if (existingRows.length === 0) {
        return res.status(404).json({ error: 'Vehicle not found.' });
      }
      const existing = db.formatVehicle(existingRows[0], req.get('host'));
      const updateData = { ...req.body };

      // Parse arrays
      let features = existing.features || [];
      if (typeof updateData.features === 'string') {
        try {
          features = JSON.parse(updateData.features);
        } catch {
          features = updateData.features.split(',').map(f => f.trim()).filter(Boolean);
        }
      } else if (Array.isArray(updateData.features)) {
        features = updateData.features;
      }

      let gallery = existing.gallery || [];
      if (typeof updateData.gallery === 'string') {
        try {
          gallery = JSON.parse(updateData.gallery);
        } catch {
          gallery = updateData.gallery.split(',').map(u => u.trim()).filter(Boolean);
        }
      } else if (Array.isArray(updateData.gallery)) {
        gallery = updateData.gallery;
      }

      let featured = existing.featured ? 1 : 0;
      if (updateData.featured !== undefined) {
        featured = (updateData.featured === true || updateData.featured === 'true' || updateData.featured === 1 || updateData.featured === '1') ? 1 : 0;
      }

      // Parse numbers
      const year = updateData.year !== undefined ? parseInt(updateData.year, 10) : existing.year;
      const engine_cc = updateData.engine_cc !== undefined ? (updateData.engine_cc ? parseInt(updateData.engine_cc, 10) : null) : existing.engine_cc;
      const mileage_km = updateData.mileage_km !== undefined ? (updateData.mileage_km ? parseInt(updateData.mileage_km, 10) : null) : existing.mileage_km;
      const price_fob_jpy = updateData.price_fob_jpy !== undefined ? (updateData.price_fob_jpy ? parseInt(updateData.price_fob_jpy, 10) : null) : existing.price_fob_jpy;
      const price_fob_usd = updateData.price_fob_usd !== undefined ? (updateData.price_fob_usd ? parseFloat(updateData.price_fob_usd) : null) : existing.price_fob_usd;

      let imageUrl = updateData.image_url !== undefined ? updateData.image_url : existing.image_url;

      // Handle uploaded main image (compressed to WebP)
      if (req.files && req.files.main_image && req.files.main_image[0]) {
        deleteLocalFile(existing.image_url);
        const filename = await processAndSaveImage(req.files.main_image[0].buffer, 'vehicle-main');
        imageUrl = getImageUrl(req, filename);
      }

      // Handle uploaded gallery images (compressed to WebP)
      if (req.files && req.files.gallery_images && req.files.gallery_images.length > 0) {
        const galleryFilenames = await Promise.all(
          req.files.gallery_images.map(f => processAndSaveImage(f.buffer, 'vehicle-gallery'))
        );
        const uploadedGallery = galleryFilenames.map(fn => getImageUrl(req, fn));
        gallery = [...gallery, ...uploadedGallery];
      }

      await db.query(
        `UPDATE \`vehicles\` SET
          make = ?,
          model = ?,
          year = ?,
          category = ?,
          body_type = ?,
          transmission = ?,
          fuel_type = ?,
          engine_cc = ?,
          mileage_km = ?,
          color = ?,
          price_fob_jpy = ?,
          price_fob_usd = ?,
          status = ?,
          location = ?,
          image_url = ?,
          gallery = ?,
          features = ?,
          featured = ?,
          description = ?,
          chassis_no = ?,
          stock_id = ?
        WHERE id = ?`,
        [
          updateData.make !== undefined ? updateData.make : existing.make,
          updateData.model !== undefined ? updateData.model : existing.model,
          year,
          updateData.category !== undefined ? updateData.category : existing.category,
          updateData.body_type !== undefined ? updateData.body_type : existing.body_type,
          updateData.transmission !== undefined ? updateData.transmission : existing.transmission,
          updateData.fuel_type !== undefined ? updateData.fuel_type : existing.fuel_type,
          engine_cc,
          mileage_km,
          updateData.color !== undefined ? updateData.color : existing.color,
          price_fob_jpy,
          price_fob_usd,
          updateData.status !== undefined ? updateData.status : existing.status,
          updateData.location !== undefined ? updateData.location : existing.location,
          imageUrl,
          JSON.stringify(gallery),
          JSON.stringify(features),
          featured,
          updateData.description !== undefined ? updateData.description : existing.description,
          updateData.chassis_no !== undefined ? updateData.chassis_no : existing.chassis_no,
          updateData.stock_id !== undefined ? updateData.stock_id : existing.stock_id,
          req.params.id,
        ]
      );

      const updatedRows = await db.query('SELECT * FROM `vehicles` WHERE id = ? LIMIT 1', [req.params.id]);
      res.json(db.formatVehicle(updatedRows[0], req.get('host')));
    } catch (err) {
      console.error('Error updating vehicle:', err);
      res.status(500).json({ error: 'Failed to update vehicle.', details: err.message });
    }
  }
);

// DELETE /api/vehicles/:id — Delete vehicle
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const existingRows = await db.query('SELECT * FROM `vehicles` WHERE id = ? LIMIT 1', [req.params.id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    const vehicle = db.formatVehicle(existingRows[0], req.get('host'));

    // Delete associated uploaded images
    deleteLocalFile(vehicle.image_url);
    if (vehicle.gallery) {
      vehicle.gallery.forEach(url => deleteLocalFile(url));
    }

    await db.query('DELETE FROM `vehicles` WHERE id = ?', [req.params.id]);
    res.json({ message: 'Vehicle deleted successfully.', id: req.params.id });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(500).json({ error: 'Failed to delete vehicle.' });
  }
});

module.exports = router;
