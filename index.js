// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cron = require('node-cron');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Import models and routes
const Order = require('./models/orderModel');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const userOrderRoutes = require('./routes/userOrderRoutes');
const adminController = require('./controllers/adminController');
const connectDB = require('./config/db');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const mongoDBUrl = process.env.MONGODB_URL;

mongoose.connect(mongoDBUrl, { serverSelectionTimeoutMS: 20000 })
  .then(async () => {
    console.log('MongoDB connected');
    // Create super admin if it doesn't exist
    try {
      await adminController.createSuperAdmin();
      console.log('Super admin created (if not existing)');
    } catch (err) {
      console.error('Error creating super admin:', err);
    }
  })
  .catch(err => console.log(err));

// Middleware
app.use(cors({
  origin: 'https://blossomsbotique.com/',  // frontend URL
  credentials: true,  // allow sending cookies
})); // Enable CORS
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads
app.use(cookieParser()); // To parse cookies

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set destination for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
  },
});
const upload = multer({ storage }); // Initialize multer with storage configuration

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', upload.single('image'), productRoutes); // Use multer middleware for product routes
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes); // Use cart routes under '/api/cart'
app.use('/api/address', addressRoutes);
app.use('/api/userOrders', userOrderRoutes);

// Cron job: Run every day at midnight to update order statuses
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const orders = await Order.updateMany(
      {
        "primaryInfo.shippingStatus": { $ne: 'Delivered' },
        "primaryInfo.estimatedDeliveryDate": { $lt: now }
      },
      { $set: { "primaryInfo.shippingStatus": 'Delivered' } }
    );
    console.log(`Updated ${orders.nModified} orders to 'Delivered'`);
  } catch (error) {
    console.error('Error updating order statuses:', error);
  }
});

// Error handling middleware
app.use(errorHandler); // Custom error handling middleware

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
































// // Import dependencies
// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const cors = require('cors');
// const cron = require('node-cron');
// const multer = require('multer');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config();

// // Import models and routes
// const Order = require('./models/orderModel');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const adminController = require('./controllers/adminController');
// const connectDB = require('./config/db'); // If db.js is inside the config folder

// // Initialize the Express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// // connectDB(); // Use if you have a separate connectDB function in config/db.js

// const mongoDBUrl = process.env.MONGODB_URL ;
// // console.log(mongoDBUrl);
// mongoose.connect(mongoDBUrl, { serverSelectionTimeoutMS: 20000 })
//   .then(async () => {
//     console.log('MongoDB connected');
//     // Create super admin if it doesn't exist
//     try {
//       await adminController.createSuperAdmin();
//       console.log('Super admin created (if not existing)');
//     } catch (err) {
//       console.error('Error creating super admin:', err);
//     }
//   })
//   .catch(err => console.log(err));

// // Middleware
// app.use(cors()); // Enable CORS
// app.use(bodyParser.json()); // Parse incoming requests with JSON payloads

// // Set up multer for handling file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Set destination for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
//   },
// });
// const upload = multer({ storage }); // Initialize multer with storage configuration

// // Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/products', upload.single('image'), productRoutes); // Use multer middleware
// app.use('/api/orders', orderRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);

// // Cron job: Run every day at midnight to update order statuses
// cron.schedule('0 0 * * *', async () => { 
//   try {
//     const now = new Date();
//     const orders = await Order.updateMany(
//       {
//         "primaryInfo.shippingStatus": { $ne: 'Delivered' },
//         "primaryInfo.estimatedDeliveryDate": { $lt: now }
//       },
//       { $set: { "primaryInfo.shippingStatus": 'Delivered' } }
//     );
//     console.log(`Updated ${orders.nModified} orders to 'Delivered'`);
//   } catch (error) {
//     console.error('Error updating order statuses:', error);
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
