const express = require('express');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Default 7 categories requested by client
const DEFAULT_CATEGORIES = [
  'Trucks',
  'Cars',
  'Tyre Shover',
  'Forklifts',
  'Agricultural Machines',
  'Truck Fixtures',
  'Other Parts',
];

// Helper: Seed default categories if none exist
async function seedDefaultCategories() {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log('Seeding default categories...');
      const docs = DEFAULT_CATEGORIES.map((name, index) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        order: index + 1,
      }));
      await Category.insertMany(docs);
      console.log('Default categories seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding categories:', err.message);
  }
}

// GET /api/categories — List all categories
router.get('/', async (req, res) => {
  try {
    let categories = await Category.find().sort({ order: 1, createdAt: 1 });
    if (categories.length === 0) {
      await seedDefaultCategories();
      categories = await Category.find().sort({ order: 1, createdAt: 1 });
    }
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// POST /api/categories — Create a new category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const trimmed = name.trim();
    // Check if already exists
    const existing = await Category.findOne({ name: new RegExp('^' + trimmed + '$', 'i') });
    if (existing) {
      return res.json(existing);
    }

    const count = await Category.countDocuments();
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newCat = await Category.create({
      name: trimmed,
      slug,
      order: count + 1,
    });

    res.status(201).json(newCat);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Failed to create category.' });
  }
});

// PUT /api/categories/:id — Update existing category
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const trimmed = name.trim();
    const cat = await Category.findById(req.params.id);
    if (!cat) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const oldName = cat.name;
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    cat.name = trimmed;
    cat.slug = slug;
    await cat.save();

    // Cascade update to vehicles assigned to old category name
    const Vehicle = require('../models/Vehicle');
    await Vehicle.updateMany({ category: oldName }, { category: trimmed });

    res.json(cat);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

// DELETE /api/categories/:id — Delete category
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully.', id: req.params.id });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

module.exports = {
  router,
  seedDefaultCategories,
  DEFAULT_CATEGORIES,
};

