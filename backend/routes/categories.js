const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');
const Category = require('../models/Category');

// Create a category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const category = new Category({ ...req.body, user: req.user });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: 'Error creating category', error: err.message });
  }
});

// Get all categories for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find({ $or: [ { user: req.user }, { user: null } ] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
});

// Get a single category by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, $or: [ { user: req.user }, { user: null } ] });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
});

// Update a category
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: 'Error updating category', error: err.message });
  }
});

// Delete a category
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
});

module.exports = router; 