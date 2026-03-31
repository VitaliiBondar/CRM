import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./models/User.js";

dotenv.config();

const createRecruiter = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({
      email: "recruiter@crm.local",
    });

    if (existingUser) {
      console.log("Рекрутер уже існує");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash("recruiter123", 10);

    await User.create({
      email: "recruiter@crm.local",
      passwordHash,
      fullName: "Recruiter User",
      role: "recruiter",
    });

    console.log("Рекрутер створений");
    process.exit(0);
  } catch (error) {
    console.error("Помилка при створенні рекрутера:", error);
    process.exit(1);
  }
};

createRecruiter();
