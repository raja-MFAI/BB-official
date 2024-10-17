const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  countryCode:{
    type: String,
    // required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);
