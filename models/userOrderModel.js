// backend/models/orderModel.js
const mongoose = require('mongoose');

// Define the order schema
const userOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the order model
const UserOrder = mongoose.model('UserOrder', userOrderSchema);

module.exports = UserOrder;
