// 1. Load Environment Variables (MUST BE FIRST)
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); // Ensure you have this file
const cors = require('cors');

// 2. Import Routes
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const paymentRoutes = require('./routes/payment');

const app = express();

// 3. Connect to MongoDB
connectDB();

// 4. Middleware
app.use(express.json()); // Allows server to read JSON data
app.use(cors());         // Allows Frontend to talk to Backend

// 5. Define Routes (Connect the wires)
app.use('/api/auth', authRoutes);           // Login & Register
app.use('/api/portfolio', portfolioRoutes); // Buying, Selling, Prices
app.use('/api/payment', paymentRoutes);     // Razorpay

// 6. Test Route (To check if server is alive)
app.get('/', (req, res) => res.send('API is running...'));

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));