require("dotenv").config();
const mongoose = require("mongoose");

// ✅ Cache the connection across serverless invocations
let isConnected = false;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined.");
    return;
  }

  // ✅ لو الـ connection موجود متوصلش تاني
  if (isConnected) {
    console.log("♻️ Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false, // ✅ متستناش لو مفيش connection
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    isConnected = false;
    console.error("❌ MongoDB connection error:", err);
    throw err; // ✅ ابعت الـ error للـ route عشان يرجع 500
  }
};

module.exports = connectDB;
