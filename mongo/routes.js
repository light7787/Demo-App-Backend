
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';



router.post('/signup', async (req, res) => {
    console.log("Signup request received:", req.body); // Log incoming request
    
    try {
      const { name, email, password } = req.body;
      
      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("Duplicate email attempt:", email);
        return res.status(409).json({ message: 'Email already in use' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");
  
      // Create user
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      console.log("User created:", user.email);
  
      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      res.status(201).json({ 
        token, 
        userId: user._id, 
        name: user.name 
      });
  
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ 
        message: error.message || 'Server error during signup' 
      });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Create token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      
      res.json({ token, userId: user._id, name: user.name });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
  module.exports = router;