require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

async function changePassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const newPassword = "Bikash@1506";

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email: "admin@pixelperfect.com" },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log("Admin user not found.");
    } else {
      console.log("Admin password changed successfully.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

changePassword();
