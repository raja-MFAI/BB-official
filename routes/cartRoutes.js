// backend/routes/cartRoutes.js
const express = require('express');
const { getCartItems, updateCartItem, removeCartItem } = require('../controllers/cartController');
const protect = require('../middleware/authMiddleware'); // Import the middleware
const router = express.Router();

router.use(protect); // Apply the middleware to all routes in this file

router.get('/', getCartItems); // GET /api/cart
router.put('/update', updateCartItem); // POST /api/cart/update
router.put('/remove', removeCartItem); // DELETE /api/cart/remove

module.exports = router;
