// routes/userRoutes.js
const express = require('express');
const User = require('../models/User'); // Adjust the path as necessary
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Route to get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name email _id'); // Fetch only name, email, and _id
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});
router.get('/users/me', async (req, res) => {
  try {
    const userEmail = req.user.email; // Assuming the email is set on req.user after token verification
    const user = await User.findOne({ email: userEmail }); // Find the user by email

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data. Please try again later.' });
  }
});

module.exports = router;
