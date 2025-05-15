const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  validateSignupData,
  validateSigninData,
} = require("../utils/validation");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("../config/database");
const mongoose = require("mongoose");

authRouter.post("/signup", async (req, res) => {
  // validation of data
  try {
    await validateSignupData(req.body);
    const user = req.body;
    const { firstName, lastName, emailId, password } = user;
    console.log(user);
    //encrypting the password
    const hashPassword = await bcrypt.hash(password, 10);

    //creating the new instance of the user model
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword, // Store the hashed password
    });

   const savedUser = await newUser.save();
   const token = jwt.sign({ id: savedUser._id }, "secret", { expiresIn: "1h" });
   res.cookie("token",token,{
    httpOnly: true,
    sameSite: 'lax', // 'strict', 'lax', or 'none' (with secure: true for 'none')
    // secure: true, // Uncomment in production with HTTPS
    maxAge: 3600000 // 1 hour in milliseconds
   })
    
    res.json({message:"User created successfully",Data:savedUser});
  } catch (error) {
    res.status(400).send(error.message);
    console.log("Error creating user", error.message);
  }
});







authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
      
      // Set cookie with appropriate options
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'lax', // 'strict', 'lax', or 'none' (with secure: true for 'none')
        // secure: true, // Uncomment in production with HTTPS
        maxAge: 3600000 // 1 hour in milliseconds
      });
      
      // Make sure to use these headers
      res.setHeader('Content-Type', 'application/json');
      
      // Send response
      return res.status(200).json({ 
        success: true, 
        message: "Login successful",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailId: user.emailId,
          // Don't include sensitive data like password
        }
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid Password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("Logout successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = authRouter;
