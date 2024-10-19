// backend/models/addressModel.js
const mongoose = require('mongoose');

// Define the address schema
const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true, // Assuming name is required
  },
  phoneNum: {
    type: String,
    required: true, // Assuming phone number is required
  },
  street: {
    type: String,
    required: true,
  },
  areaRegion: {
    type: String,
    required: true, // Assuming area/region is required
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  addressType: {
    type: String,
    enum: ['Home', 'Work'], // Options for address type
    required: true,
  },
});

// Create the address model
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
