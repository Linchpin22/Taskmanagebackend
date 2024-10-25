const express = require('express');
const User = require('../models/User'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');  // For password hashing
const jwt = require('jsonwebtoken'); // For generating tokens
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

// Route to get the authenticated user's details
router.get('/users/me', verifyToken, async (req, res) => { // Ensure token verification
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

// Route for user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check for empty fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password); // Changed bcryptjs to bcrypt
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token (you can also set the expiration time)
    const token = jwt.sign({ email: user.email, id: user._id }, 'your_secret_key', { expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
