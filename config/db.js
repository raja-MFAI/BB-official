// db.js
const mongoose = require('mongoose');
require('dotenv').config();  // To load environment variables from .env file

const connectDB = async () => {
  try {
    // Connecting to MongoDB using the environment variable for MONGO_URI
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  // Exit process with failure
  }
};

module.exports = connectDB;
