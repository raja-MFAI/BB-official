// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const protect = async (req, res, next) => {
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Remove password from the user data
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = protect;
