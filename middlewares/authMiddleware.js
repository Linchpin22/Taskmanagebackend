const STATIC_TOKENS = {
  user: 'static-user-token',
  admin: 'static-admin-token', 
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    console.error("No Authorization header provided");
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  console.log("Extracted token:", token);

  if (!token) {
    console.error("Invalid token format");
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  // Check if the token is static for user or admin
  if (token === STATIC_TOKENS.admin) {
    req.user = { role: 'admin', id: 'admin-id-placeholder' }; // Assign admin role and id to req.user
    console.log("Admin token verified");
    next();
  } else if (token === STATIC_TOKENS.user) {
    req.user = { role: 'user', id: 'user-id-placeholder' }; // Assign user role and id to req.user
    console.log("User token verified");
    next();
  } else {
    console.error("Token does not match any known tokens");
    return res.status(403).json({ error: 'Access denied. Invalid token.' });
  }
};

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
