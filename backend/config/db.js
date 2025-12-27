const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect using the URL from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); // Stop server if database fails
  }
};

module.exports = connectDB;