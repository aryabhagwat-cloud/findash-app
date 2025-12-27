const express = require('express');
const router = express.Router();
const axios = require('axios'); // Ensure axios is required
const auth = require('../middleware/auth');
const User = require('../models/User');

// --- HARDCODED KEY (To fix connection issues) ---
const API_KEY = "d55aj5pr01qui216vasgd55aj5pr01qui216vat0"; 

// @route   GET api/portfolio/price/:symbol
// @desc    Get Real-Time Stock Price
router.get('/price/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  console.log(`🤖 Backend: Request received for ${symbol}`); // Log 1

  try {
    // 1. Check if Key exists
    if (!API_KEY) {
      console.error("❌ Error: API Key is missing.");
      return res.status(500).json({ msg: "Server Configuration Error: No API Key" });
    }

    // 2. Call Finnhub
    console.log(`📡 Fetching data from Finnhub...`);
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
    
    const price = response.data.c; // 'c' is the current price
    console.log(`✅ Success! Price for ${symbol} is $${price}`); // Log 2

    // 3. Handle Invalid Stock Symbol (Price = 0)
    if (price === 0) {
      return res.status(404).json({ msg: `Invalid Symbol: ${symbol}` });
    }

    res.json({ symbol, price });

  } catch (err) {
    // This prints the EXACT error to your Black Terminal
    console.error("❌ Backend Error:", err.message); 
    if (err.response) {
      console.error("Finnhub Response:", err.response.data);
    }
    res.status(500).json({ msg: "Server Error: Could not fetch price." });
  }
});

// @route   POST api/portfolio/buy
router.post('/buy', auth, async (req, res) => {
  const { symbol, qty, price } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const cost = qty * price;

    if (user.walletBalance < cost) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }

    user.walletBalance -= cost;

    const existingStock = user.portfolio.find(s => s.symbol === symbol);
    if (existingStock) {
      const oldCost = existingStock.qty * existingStock.avgPrice;
      const newCost = cost;
      const totalQty = existingStock.qty + parseInt(qty);
      existingStock.avgPrice = (oldCost + newCost) / totalQty;
      existingStock.qty = totalQty;
    } else {
      user.portfolio.push({ symbol, qty, avgPrice: price });
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/portfolio/sell
router.post('/sell', auth, async (req, res) => {
  const { symbol, qty, price } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const stockIndex = user.portfolio.findIndex(s => s.symbol === symbol);

    if (stockIndex === -1) return res.status(400).json({ msg: "You don't own this stock!" });
    if (user.portfolio[stockIndex].qty < qty) return res.status(400).json({ msg: "Not enough shares." });

    user.portfolio[stockIndex].qty -= parseInt(qty);
    if (user.portfolio[stockIndex].qty === 0) user.portfolio.splice(stockIndex, 1);

    user.walletBalance += parseFloat(qty) * parseFloat(price);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;