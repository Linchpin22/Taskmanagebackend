const User = require('../models/User');

const STATIC_TOKENS = {
  user: 'static-user-token',
  admin: 'static-admin-token',
};

const STATIC_ADMIN_EMAIL = 'admin@ex.com';

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const emailHeader = req.headers['x-user-email']; // Custom header for user email
console.log(authHeader, emailHeader, " heloo");
  if (!authHeader) {
    console.error("No Authorization header provided");
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    console.error("Invalid token format");
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  // Check if the token matches the static admin token
  if (token === STATIC_TOKENS.admin) {
    // Confirm email matches static admin email
    if (emailHeader !== STATIC_ADMIN_EMAIL) {
      console.error("Admin email mismatch");
      return res.status(403).json({ error: 'Access denied. Invalid email for admin.' });
    }

    req.user = { role: 'admin', email: STATIC_ADMIN_EMAIL };
    console.log("Admin token and email verified");
    return next();
  } 
  
  // Check if the token matches the static user token
  else if (token === STATIC_TOKENS.user) {
    if (!emailHeader) {
      console.error("User email not provided in headers");
      return res.status(403).json({ error: 'Access denied. Email header missing.' });
    }

    try {
      // Fetch user by email from database
      const user = await User.findOne({ email: emailHeader });
      if (!user) {
        console.error("User not found for the given email");
        return res.status(403).json({ error: 'Access denied. Invalid token or user not found.' });
      }

      req.user = { role: 'user', id: user._id, email: user.email };
      console.log("User token and email verified for user ID:", req.user.id);
      return next();
    } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } 

  // If the token doesn't match any known static tokens
  else {
    console.error("Token does not match any known tokens");
    return res.status(403).json({ error: 'Access denied. Invalid token.' });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    console.error("No user information available on request");
    return res.status(401).json({ error: 'Access denied. User not authenticated.' });
  }

  if (req.user.role !== 'admin') {
    console.error("Access denied: User is not an admin");
    return res.status(403).json({ error: 'Admin access required' });
  }

  console.log("Admin access granted");
  next();
};

module.exports = { verifyToken, isAdmin };
