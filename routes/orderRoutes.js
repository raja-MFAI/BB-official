const express = require('express');
const { 
    getSalesData, 
    createOrder, 
    getAllOrders, 
    searchOrders, 
    getOrdersByShippingStatus, 
    getOrderById, 
    deleteOrder, 
    updateOrderShipping 
} = require('../controllers/orderController');
const router = express.Router();

router.get('/sales-data', getSalesData); // Sales data route

// Route to create an order
router.post('/orders', createOrder);
router.get('/orders/search', searchOrders); // Search route

// Route to get all orders
router.get('/allorders', getAllOrders);

// Route to get orders by shipping status
router.get('/orders/shipping-status/:status', getOrdersByShippingStatus); // Only one of these

// Route to get an order by its MongoDB _id
router.get('/orders/:id', getOrderById);

// Route to delete an order by ID
router.delete('/orders/:id', deleteOrder);

// Route to update order's shipping status
router.put('/orders/:id/shipping', updateOrderShipping);

module.exports = router;
