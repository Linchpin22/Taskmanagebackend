// routes/userRoutes.js
const express = require('express');
const User = require('../models/User'); // Adjust the path as necessary
const router = express.Router();

// Route to get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name email _id'); // Fetch only name, email, and _id
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
