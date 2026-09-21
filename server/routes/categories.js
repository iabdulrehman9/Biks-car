const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

function formatCategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    order: row.display_order !== undefined ? row.display_order : 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// GET /api/categories — List all categories
router.get('/', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM `categories` ORDER BY `display_order` ASC, `created_at` ASC');
    res.json(rows.map(formatCategory));
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
    // Check if already exists (case-insensitive)
    const existing = await db.query('SELECT * FROM `categories` WHERE LOWER(name) = LOWER(?) LIMIT 1', [trimmed]);
    if (existing.length > 0) {
      return res.json(formatCategory(existing[0]));
    }

    const countRows = await db.query('SELECT COUNT(*) AS cnt FROM `categories`');
    const order = (countRows[0]?.cnt || 0) + 1;
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newId = db.generateId();

    await db.query(
      'INSERT INTO `categories` (id, name, slug, display_order) VALUES (?, ?, ?, ?)',
      [newId, trimmed, slug, order]
    );

    const inserted = await db.query('SELECT * FROM `categories` WHERE id = ? LIMIT 1', [newId]);
    res.status(201).json(formatCategory(inserted[0]));
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
    const existing = await db.query('SELECT * FROM `categories` WHERE id = ? LIMIT 1', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const oldName = existing[0].name;
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await db.query(
      'UPDATE `categories` SET name = ?, slug = ? WHERE id = ?',
      [trimmed, slug, req.params.id]
    );

    // Cascade update to vehicles assigned to old category name
    await db.query('UPDATE `vehicles` SET category = ? WHERE category = ?', [trimmed, oldName]);

    const updated = await db.query('SELECT * FROM `categories` WHERE id = ? LIMIT 1', [req.params.id]);
    res.json(formatCategory(updated[0]));
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

// DELETE /api/categories/:id — Delete category
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await db.query('SELECT * FROM `categories` WHERE id = ? LIMIT 1', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    await db.query('DELETE FROM `categories` WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted successfully.', id: req.params.id });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

module.exports = {
  router,
  DEFAULT_CATEGORIES: db.DEFAULT_CATEGORIES,
};
