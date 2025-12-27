const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTRATION ROUTE
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create new user
    user = new User({
      name,
      email,
      password,
      walletBalance: 50000 // Starting Cash
    });

    // 3. Encrypt the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save to MongoDB
    await user.save();

    // 5. Create a "Token" (Digital ID Card)
    const payload = { user: { id: user.id } };
    
    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token back to frontend
      }
    );

  }  catch (err) {
    console.error("❌ Registration Error:", err.message);
    // FIX: Send JSON, not text
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Login Success! Send Token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET USER DATA ROUTE
// This is protected! You need a token to access it.
const auth = require('../middleware/auth'); // Import the security guard

router.get('/user', auth, async (req, res) => {
  try {
    // Find the user by ID (exclude the password)
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;    