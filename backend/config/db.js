const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error(
      "[Database Error] MONGO_URI is not defined in environment variables!"
    );
    process.exit(1);
  }

  // Safely mask password in logs
  const maskedUri = mongoUri.replace(
    /^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/,
    "$1$2:****@"
  );

  console.log(`[Database] Attempting to connect: ${maskedUri}`);

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;

    console.log(
      `[Database] MongoDB Connected: ${connection.connection.host}`
    );
  } catch (err) {
    console.error(
      `[Database Error] MongoDB connection failed: ${err.message}`
    );
    process.exit(1);
  }
};

module.exports = connectDB;