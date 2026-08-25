const mongooseDB = require("mongoose");

const connectDB = async () => {
  try {
    await mongooseDB.connect("mongodb://localhost:27017/storeDB");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
};

module.exports = connectDB;