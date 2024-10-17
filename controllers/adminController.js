const Admin = require('../models/adminSchema');
const jwt = require('jsonwebtoken'); // For session management (optional)
const bcrypt = require('bcryptjs');



// Static email and password for super admin (could also be stored in .env)

const JWT_SECRET = process.env.JWT_SECRET;

// Admin login function
// Admin login function
exports.adminLogin = async (req, res) => {

    const JWT_SECRET = process.env.JWT_SECRET;
    const { email, password } = req.body;

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });

        console.log(admin);
        console.log("The password is:", password);
        console.log(process.env.SUPER_ADMIN_PASSWORD)

        if (!admin) {
            return res.status(401).json({ error: 'Cant find the admin' });
        }

        console.log(password != process.env.SUPER_ADMIN_PASSWORD);

        // Check if the password is correct
        if (password !== process.env.SUPER_ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Password is Incorrect' });
        }

        // Create a JWT token for session management
        const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '10d' });

        // Respond with a success message and the token
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        // Catch any errors and return a response
        return res.status(400).json({ error: error.message });
    }
};


// Create the default super admin (only runs once during initialization)
exports.createSuperAdmin = async () => {
    try {

        const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
        const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
        // Check if the super admin already exists
        const existingSuperAdmin = await Admin.findOne({ email: SUPER_ADMIN_EMAIL });

        if (!existingSuperAdmin) {
            // Create super admin
            const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
            const superAdmin = new Admin({ email: SUPER_ADMIN_EMAIL, password:hashedPassword });
            await superAdmin.save();
            console.log('Super Admin created successfully');
        } else {
            console.log('Super Admin already exists');
        }
    } catch (error) {
        console.error('Error creating Super Admin:', error);
    }
};
