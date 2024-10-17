// controllers/productController.js
const Product = require('../models/Product');

// Create new product
// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPercentage, discountType, material, quantity, category, size, colors, tags } = req.body;

    const parsedColors = Array.isArray(colors) ? colors : JSON.parse(colors || '[]');
    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags || '[]');

    const newProduct = new Product({
      name,
      description,
      material,
      price,
      discountPercentage,
      discountType,
      quantity,
      category,
      size,
      colors: parsedColors,
      tags: parsedTags,
    });

    if (req.file) {
      newProduct.imageUrl = `/uploads/${req.file.filename}`;
    }

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error });
  }
};


// Get all products
exports.getProducts = async (req, res) => {
  try {
    console.log('Fetching all products...'); // Log action
    const products = await Product.find();
     // Log products
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};
// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Error fetching product by ID', error });
  }
};

// Update existing product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, discountPercentage, discountType, material, quantity, category, size } = req.body;

    // Parse colors and tags from JSON strings
    const colors = JSON.parse(req.body.colors || '[]');
    const tags = JSON.parse(req.body.tags || '[]');

    const updatedData = {
      name,
      description,
      material,
      price,
      discountPercentage,
      discountType,
      quantity,
      category,
      size,
      colors,
      tags,
    };

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`; // Update image URL if a new image is uploaded
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
};
// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Get all products or filter by name or category
exports.getProducts = async (req, res) => {
  try {
    const { search } = req.query; // Get the search query parameter
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } }, // Case-insensitive search by name
          { category: { $regex: search, $options: 'i' } }, // Case-insensitive search by category
        ],
      };
    }

    const products = await Product.find(query); // Find products based on search query
    console.log('Data fetched'); // Log message without showing actual data
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};
exports.getLowStockProducts = async (req, res) => {
  try {
    const lowStockThreshold = 10;
    const lowStockProducts = await Product.find({ quantity: { $lte: lowStockThreshold } });
    res.status(200).json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Error fetching low stock products', error });
  }
};
