const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');
const Vendor = require('../models/Vendor');

// Create a vendor
router.post('/', authMiddleware, async (req, res) => {
  try {
    const vendor = new Vendor({ ...req.body, user: req.user });
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ message: 'Error creating vendor', error: err.message });
  }
});

// Get all vendors for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const vendors = await Vendor.find({ user: req.user });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vendors', error: err.message });
  }
});

// Get a single vendor by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ _id: req.params.id, user: req.user });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vendor', error: err.message });
  }
});

// Update a vendor
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ message: 'Error updating vendor', error: err.message });
  }
});

// Delete a vendor
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting vendor', error: err.message });
  }
});

module.exports = router; 