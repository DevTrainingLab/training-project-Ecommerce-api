require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error(
      "❌ MONGO_URI is not defined. Set it in Vercel Environment Variables."
    );
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // optional, يزود timeout لو فيه بطء
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

module.exports = connectDB;
