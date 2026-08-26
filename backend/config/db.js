// backend/config/db.js
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("[Database Error] MONGO_URI is not defined in environment variables!");
    return;
  }

  // Safe logging: masks password so you can safely verify the username & host in Render logs
  const maskedUri = mongoUri.replace(/:\/\/(.*?):(.*?)@/, "://$1:****@");
  console.log(`[Database] Attempting to connect: ${maskedUri}`);

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.error(`[Database Error] MongoDB connection failed: ${err.message}`);
  }
};

module.exports = connectDB;