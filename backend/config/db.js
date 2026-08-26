const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pixel_db";
  
  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.error(`[Database Error] MongoDB connection failed: ${err.message}`);
    console.warn(`[Database Warning] Please ensure MongoDB service is running (e.g. 'mongod' or 'sudo systemctl start mongod').`);
  }
};

module.exports = connectDB;