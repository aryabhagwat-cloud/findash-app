const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST api/payment/order
// @desc    Step 1: Create a Razorpay Order
router.post('/order', auth, async (req, res) => {
  const { amount } = req.body; // Amount in Rupees

  try {
    const options = {
      amount: amount * 100, // Razorpay works in Paisa (1 Rupee = 100 Paisa)
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// @route   POST api/payment/verify
// @desc    Step 2: Verify Payment & Add Money to Wallet
router.post('/verify', auth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

  try {
    // 1. Create the expected signature using your Secret Key
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // 2. Compare signatures
    if (razorpay_signature === expectedSign) {
      
      // ✅ Payment is Legit! Add money to DB.
      const user = await User.findById(req.user.id);
      
      // Convert INR back to USD for the simulator (Optional logic choice)
      // For now, let's assume 1 Rupee = 1 Dollar for simplicity, or just add the amount.
      user.walletBalance += parseInt(amount); 
      
      await user.save();
      
      return res.json({ msg: "Payment Verified", success: true });
    } else {
      return res.status(400).json({ msg: "Invalid Signature" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;