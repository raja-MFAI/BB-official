const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB Atlas connected successfully');
    mongoose.connection.close(); // Close connection after success
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
