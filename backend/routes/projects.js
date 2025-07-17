const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');
const Project = require('../models/Project');

// Create a project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = new Project({ ...req.body, user: req.user });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: 'Error creating project', error: err.message });
  }
});

// Get all projects for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
});

// Get a single project by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project', error: err.message });
  }
});

// Update a project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: 'Error updating project', error: err.message });
  }
});

// Delete a project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
});

module.exports = router; 