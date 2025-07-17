const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');
const Budget = require('../models/Budget');

// Create a budget
router.post('/', authMiddleware, async (req, res) => {
  try {
    const budget = new Budget({ ...req.body, user: req.user });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: 'Error creating budget', error: err.message });
  }
});

// Get all budgets for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user }).populate('category');
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching budgets', error: err.message });
  }
});

// Get a single budget by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user }).populate('category');
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching budget', error: err.message });
  }
});

// Update a budget
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    ).populate('category');
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: 'Error updating budget', error: err.message });
  }
});

// Delete a budget
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting budget', error: err.message });
  }
});

module.exports = router; 