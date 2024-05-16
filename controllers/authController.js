const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { model } = require('mongoose');

// @desc Register a user
// @route POST /api/v1/auth/register
// @access Public

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }
  
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
  
    console.log(`User created ${user}`);
    if (user) {
      res.status(201).json({ 
        success: true, 
        msg: "User created successfully", 
        data: { _id: user.id, email: user.email }
    });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
});

module.exports = { registerUser };