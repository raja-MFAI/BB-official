// backend/routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const { saveAddress, getAddress } = require('../controllers/addressController'); // Ensure this path is correct
const protect = require('../middleware/authMiddleware'); // For user authentication

// Route to save user's address
router.post('/', protect, saveAddress);

// Route to get user's address
router.get('/', protect, getAddress);

module.exports = router;
