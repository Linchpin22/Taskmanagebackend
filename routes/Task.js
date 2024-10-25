const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
      const tasks = await Task.find();
      return res.json(tasks);
  } catch (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Failed to fetch tasks. Please try again later.' });
  }
});

// Create a new task
router.post('/create', verifyToken, isAdmin, async (req, res) => {
  const { title, description, assignedTo } = req.body;

  // Input validation
  if (!title || !description || !assignedTo) {
    return res.status(400).json({ error: 'Title, description, and assignedTo are required.' });
  }

  try {
    const task = new Task({
      title,
      description,
      assignedTo,
    });

    await task.save();
    return res.status(201).json(task); // Return the created task
  } catch (err) {
    console.error('Error creating task:', err); // Log the error for debugging
    return res.status(500).json({ error: 'Failed to create task. Please try again later.' });
  }
});

// Admin can update a task
router.put('/update/:id', verifyToken, isAdmin, async (req, res) => {
  const { title, description, assignedTo } = req.body;

  // Validate input fields if they are provided
  if (title === undefined && description === undefined && assignedTo === undefined) {
    return res.status(400).json({ error: 'At least one field (title, description, assignedTo) must be provided for update.' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    return res.json(updatedTask); // Return the updated task
  } catch (err) {
    console.error('Error updating task:', err); // Log the error for debugging
    return res.status(500).json({ error: 'Failed to update task. Please try again later.' });
  }
});

// Admin can delete a task
router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    return res.json({ message: 'Task deleted successfully' }); // Return success message
  } catch (err) {
    console.error('Error deleting task:', err); // Log the error for debugging
    return res.status(500).json({ error: 'Failed to delete task. Please try again later.' });
  }
});

// User can view assigned tasks
router.get('/my-tasks', verifyToken, async (req, res) => {
  console.log('User ID:', req.user.id); // Log the user ID for debugging
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for you.' });
    }

    return res.json(tasks); // Return the list of tasks
  } catch (err) {
    console.error('Error fetching tasks:', err); // Log the error for debugging
    return res.status(500).json({ error: 'Failed to fetch tasks. Please try again later.' });
  }
});

module.exports = router;
