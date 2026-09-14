const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Vehicle = require('../models/Vehicle');
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
    // Only delete if it's a local upload (contains /uploads/)
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
    const vehicles = await Vehicle.find().sort({ created_at: -1 });
    res.json(vehicles);
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
});

// GET /api/vehicles/:id — Get single vehicle
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    res.json(vehicle);
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
      if (typeof vehicleData.features === 'string') {
        try {
          vehicleData.features = JSON.parse(vehicleData.features);
        } catch {
          vehicleData.features = vehicleData.features.split(',').map(f => f.trim()).filter(Boolean);
        }
      }
      if (typeof vehicleData.gallery === 'string') {
        try {
          vehicleData.gallery = JSON.parse(vehicleData.gallery);
        } catch {
          vehicleData.gallery = vehicleData.gallery.split(',').map(u => u.trim()).filter(Boolean);
        }
      }
      if (typeof vehicleData.featured === 'string') {
        vehicleData.featured = vehicleData.featured === 'true';
      }

      // Parse numbers
      ['year', 'engine_cc', 'mileage_km', 'price_fob_jpy'].forEach(field => {
        if (vehicleData[field]) vehicleData[field] = parseInt(vehicleData[field], 10);
      });
      if (vehicleData.price_fob_usd) {
        vehicleData.price_fob_usd = parseFloat(vehicleData.price_fob_usd);
      }

      // Handle uploaded main image (compressed to WebP)
      if (req.files && req.files.main_image && req.files.main_image[0]) {
        const filename = await processAndSaveImage(req.files.main_image[0].buffer, 'vehicle-main');
        vehicleData.image_url = getImageUrl(req, filename);
      }

      // Handle uploaded gallery images (compressed to WebP)
      if (req.files && req.files.gallery_images && req.files.gallery_images.length > 0) {
        const galleryFilenames = await Promise.all(
          req.files.gallery_images.map(f => processAndSaveImage(f.buffer, 'vehicle-gallery'))
        );
        const uploadedGallery = galleryFilenames.map(fn => getImageUrl(req, fn));
        vehicleData.gallery = [...(vehicleData.gallery || []), ...uploadedGallery];
      }

      // If gallery is empty but we have main image, add main to gallery
      if ((!vehicleData.gallery || vehicleData.gallery.length === 0) && vehicleData.image_url) {
        vehicleData.gallery = [vehicleData.image_url];
      }

      const vehicle = new Vehicle(vehicleData);
      await vehicle.save();

      res.status(201).json(vehicle);
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
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found.' });
      }

      const updateData = { ...req.body };

      // Parse arrays and booleans from form data
      if (typeof updateData.features === 'string') {
        try {
          updateData.features = JSON.parse(updateData.features);
        } catch {
          updateData.features = updateData.features.split(',').map(f => f.trim()).filter(Boolean);
        }
      }
      if (typeof updateData.gallery === 'string') {
        try {
          updateData.gallery = JSON.parse(updateData.gallery);
        } catch {
          updateData.gallery = updateData.gallery.split(',').map(u => u.trim()).filter(Boolean);
        }
      }
      if (typeof updateData.featured === 'string') {
        updateData.featured = updateData.featured === 'true';
      }

      // Parse numbers
      ['year', 'engine_cc', 'mileage_km', 'price_fob_jpy'].forEach(field => {
        if (updateData[field]) updateData[field] = parseInt(updateData[field], 10);
      });
      if (updateData.price_fob_usd) {
        updateData.price_fob_usd = parseFloat(updateData.price_fob_usd);
      }

      // Handle uploaded main image (compressed to WebP)
      if (req.files && req.files.main_image && req.files.main_image[0]) {
        // Delete old main image if it was a local upload
        deleteLocalFile(vehicle.image_url);
        const filename = await processAndSaveImage(req.files.main_image[0].buffer, 'vehicle-main');
        updateData.image_url = getImageUrl(req, filename);
      }

      // Handle uploaded gallery images (compressed to WebP)
      if (req.files && req.files.gallery_images && req.files.gallery_images.length > 0) {
        const galleryFilenames = await Promise.all(
          req.files.gallery_images.map(f => processAndSaveImage(f.buffer, 'vehicle-gallery'))
        );
        const uploadedGallery = galleryFilenames.map(fn => getImageUrl(req, fn));
        const existingGallery = updateData.gallery || vehicle.gallery || [];
        updateData.gallery = [...existingGallery, ...uploadedGallery];
      }

      Object.assign(vehicle, updateData);
      await vehicle.save();

      res.json(vehicle);
    } catch (err) {
      console.error('Error updating vehicle:', err);
      res.status(500).json({ error: 'Failed to update vehicle.', details: err.message });
    }
  }
);

// DELETE /api/vehicles/:id — Delete vehicle
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    // Delete associated uploaded images
    deleteLocalFile(vehicle.image_url);
    if (vehicle.gallery) {
      vehicle.gallery.forEach(url => deleteLocalFile(url));
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({ message: 'Vehicle deleted successfully.' });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(500).json({ error: 'Failed to delete vehicle.' });
  }
});

module.exports = router;
