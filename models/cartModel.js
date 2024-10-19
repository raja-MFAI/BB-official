// backend/models/cartModel.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.String,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
