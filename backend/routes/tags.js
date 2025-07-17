const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');
const Tag = require('../models/Tag');

// Create a tag
router.post('/', authMiddleware, async (req, res) => {
  try {
    const tag = new Tag({ ...req.body, user: req.user });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ message: 'Error creating tag', error: err.message });
  }
});

// Get all tags for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tags = await Tag.find({ user: req.user });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tags', error: err.message });
  }
});

// Get a single tag by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const tag = await Tag.findOne({ _id: req.params.id, user: req.user });
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tag', error: err.message });
  }
});

// Update a tag
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const tag = await Tag.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json(tag);
  } catch (err) {
    res.status(400).json({ message: 'Error updating tag', error: err.message });
  }
});

// Delete a tag
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const tag = await Tag.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting tag', error: err.message });
  }
});

module.exports = router; 