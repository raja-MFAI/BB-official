const mongoose = require('mongoose'); // Add this line to import mongoose

const productSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  description: { type: String },
  discountType: { type: String, enum: ['percentage', 'fixed'] },
  discountPercentage: { type: Number },  // Changed from String to Number
  colors: { type: [String] }, // Array of colors
  material: { type: String },
  size: { type: String },
  quantity: { type: Number },  // Changed from String to Number
  category: { type: String },
  tags: { type: [String] }, // Array of tags
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
