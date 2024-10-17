// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  getLowStockProducts,
  deleteProduct,
} = require('../controllers/productController');
const multer = require('multer');


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename with timestamp
  }
});

const upload = multer({ storage: storage });
router.get('/low-stock', getLowStockProducts);

// Routes
router.post('/', createProduct); // POST /api/products
// Get all products
router.get('/', getProducts); // GET /api/products
// Get product by ID
router.get('/:id', getProductById); // GET /api/products/:id
// Update product by ID
router.put('/:id', updateProduct); // PUT /api/products/:id
// Delete product by ID
router.delete('/:id', deleteProduct);// Delete a product by ID




module.exports = router;
