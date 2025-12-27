const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  walletBalance: {
    type: Number,
    default: 50000
  },
  // --- 🚨 NEW ADDITION START 🚨 ---
  portfolio: [
    {
      symbol: { type: String },
      qty: { type: Number },
      avgPrice: { type: Number }
    }
  ],
  // --- 🚨 NEW ADDITION END 🚨 ---
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);