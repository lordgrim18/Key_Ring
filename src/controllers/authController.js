const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query, matchedData, validationResult, check } = require('express-validator');
const { model } = require('mongoose');

const User = require('../models/userModel');

// @desc Register a user
// @route POST /api/v1/auth/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = matchedData(req);
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
  
    if (user) {
      res.status(201).json({ 
        success: true, 
        msg: "User created successfully", 
        data: { _id: user.id, email: user.email }
    });
    } else {
      res.status(500);
      throw new Error("Something went wrong!");
    }
});

// @desc Login a user
// @route POST /api/v1/auth/login
// @access Public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = matchedData(req);
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("No User with this email found!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid Password for given user!");
    }
  
    const token = jwt.sign(
      {
      user: {
          id: user._id,
          email: user.email, 
        },
      }, 
      process.env.ACCESS_TOKEN_SECRET, 
      {
      expiresIn: "30d",
      }
    );
    if (token) {
      res.status(200).json({
        success: true,
        msg: "User logged in successfully",
        data: { _id: user.id, email: user.email, token: token },
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials!");
    }
});

// @desc Get user info
// @route GET /api/v1/auth/user
// @access Private

const getCurrentUserInfo = asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
});

module.exports = { 
  registerUser,
  loginUser,
  getCurrentUserInfo 
};