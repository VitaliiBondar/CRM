import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ email: "admin@crm.local" });

    if (existingUser) {
      console.log("Адмін уже існує");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash("admin12345", 10);

    await User.create({
      email: "admin@crm.local",
      passwordHash,
      fullName: "System Admin",
      role: "admin",
    });

    console.log("Адмін створений");
    process.exit(0);
  } catch (error) {
    console.error("Помилка при створенні адміна:", error);
    process.exit(1);
  }
};

createAdmin();
