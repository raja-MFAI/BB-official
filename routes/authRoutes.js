const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



// Route for signup
router.post('/signup', authController.signup);


//Route for login
router.post('/login', authController.login);

//Route for reset
router.post('/reset', authController.resetPassword);


// router.get("/verify-token",authController.verifyToken);

router.get("/getuser/:userId",authController.getUserByID);
module.exports = router;
