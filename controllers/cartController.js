// backend/controllers/cartController.js
const Cart = require('../models/cartModel');
const Product = require('../models/Product'); // Make sure this is at the top


// Fetch cart items for a user
const getCartItems = async (req, res) => {
  const userId = req.user._id;
  console.log(`Fetching cart for userId: ${userId}`); 
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Calculate total price for the cart
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.productId.price;
    }, 0);

    res.json({ cart, totalPrice });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update quantity of an item in the cart
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Update the item quantity in the cart
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.user._id, 'items.productId': productId },
      { $set: { 'items.$.quantity': quantity } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json(updatedCart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: error.message });
  }
};

// Remove an item from the cart
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { items: { productId: productId } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json(updatedCart);
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCartItems,
  updateCartItem,
  removeCartItem,
};
