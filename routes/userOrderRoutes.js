// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, verifyOrder } = require('../controllers/userOrderController');
const protect = require('../middleware/authMiddleware'); // For user authentication

// Route to create an order and initiate Razorpay payment
router.post('/create', protect, createOrder);

// Route to verify payment and confirm the order
router.post('/verify', protect, verifyOrder);

module.exports = router;
