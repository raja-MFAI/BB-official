// backend/controllers/addressController.js
const Address = require('../models/addressModel');

// Save the address of a user
const saveAddress = async (req, res) => {
  try {
    const userId = req.user._id; // Ensure req.user is defined
    const { name, phoneNum, street, areaRegion, city, state, pincode, addressType } = req.body;

    // Find the user's address or create a new one
    let address = await Address.findOne({ userId });
    if (!address) {
      address = new Address({ userId });
    }

    // Update the address details
    address.name = name;
    address.phoneNum = phoneNum;
    address.street = street;
    address.areaRegion = areaRegion;
    address.city = city;
    address.state = state;
    address.pincode = pincode;
    address.addressType = addressType;

    // Save the address
    await address.save();
    res.status(200).json(address); // Set status to 200 (OK)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch the address of a user
const getAddress = async (req, res) => {
  try {
    const userId = req.user._id; // Ensure req.user is defined
    const address = await Address.findOne({ userId });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json(address); // Set status to 200 (OK)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveAddress, getAddress };
