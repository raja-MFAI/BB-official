const bcrypt = require('bcrypt');
const User = require('../models/userSchema'); // Adjust the path as needed
const https = require('https');
const jwt = require("jsonwebtoken");

// Combined verify and signup route
exports.signup = async (req, res) => {
  const { user_json_url, email, phoneNumber, password } = req.body;
  

  
  if (!user_json_url || !email || !phoneNumber || !password) {
    return res.status(400).json({ error: 'Email, phone number, password, and user_json_url are required' });
  }

  try {
    // Fetch data from the external URL
    https.get(user_json_url, async (externalRes) => {
      let data = '';

      // A chunk of data has been received
      externalRes.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received
      externalRes.on('end', async () => {
        try {
          const jsonData = JSON.parse(data);
          
          // Extract necessary data from the external response
          const user_country_code = jsonData.user_country_code;
          const user_phone_number = jsonData.user_phone_number;
          const user_first_name = jsonData.user_first_name;
          const user_last_name = jsonData.user_last_name;


          // Check if user already exists in the database
          let user = await User.findOne({ phoneNumber });

         if(user){
           return res.status(400).json({ error: "User already exists" });
         }

          // If user doesn't exist, create a new one
          if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash password

            user = new User({
              name: `${user_first_name} ${user_last_name}`,
              email,
              phoneNumber,
              countryCode: user_country_code,
              password: hashedPassword, // Save the hashed password
              isVerified: true
            });
          }

          await user.save(); // Save or update the user in the database

          console.log("User saved:", user);

          // Return a success message
          return res.status(200).json({ message: "Signup and phone verification successful!" });
        } catch (parseError) {
          return res.status(400).json({ error: "Error parsing the user data: " + parseError.message });
        }
      });
    }).on("error", (err) => {
      return res.status(400).json({ error: "Error fetching the user data: " + err.message });
    });

  } catch (error) {
    return res.status(500).json({ error: "An unexpected error occurred: " + error.message });
  }
};


// Login controller
exports.login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Email/Phone and password are required' });
  }

  try {
      // Determine if the input is an email or phone number
      const isEmail = emailOrPhone.includes('@');
      let user;

      if (isEmail) {
          // Search for user by email
          user = await User.findOne({ email: emailOrPhone });
      } else {
          // Search for user by phone number
          user = await User.findOne({ phoneNumber: emailOrPhone });
      }

      // If no user is found
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: 'Invalid password' });
      }

      const token = jwt.sign({userId:emailOrPhone }, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.cookie('token', token, {  
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use true in production (for HTTPS)
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax' // 'None' for cross-site, 'Lax' for development
    })
      
       
      return res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
      console.error('Error logging in:', error);
      return res.status(400).json({ error: 'An unexpected error occurred' });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { phoneNumber,password } = req.body;

    if ( !password ) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    let user = await User.findOneAndUpdate({ phoneNumber }, { password: hashedPassword });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Successfully updated the password
    return res.status(200).json({ message: 'Password reset successful!' });
           

  } catch (error) {
      return res.status(400).json({ error: 'Server error: ' + error.message });
  }
};


//Verification for the token
exports.verifyToken= async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
      return res.status(401).json({ authenticated: false });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ authenticated: true, userId: decoded.userId });
  } catch (error) {
      return res.status(401).json({ authenticated: false });
  }
};

exports.getUserByID = async(req,res) =>{
  const { userId } = req.params;  // Extract userId correctly from req.params

  try {
    // Use findById with the extracted userId string
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);  // Return the found user data
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}