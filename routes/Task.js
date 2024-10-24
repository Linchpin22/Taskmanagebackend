const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Admin can create task
router.post('/create', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = new Task({ title, description, assignedTo, createdBy: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin can update task
router.put('/update/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin can delete task
router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User can view assigned tasks
router.get('/my-tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
