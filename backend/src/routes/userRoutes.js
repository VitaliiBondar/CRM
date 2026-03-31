import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(allowRoles("admin"));

// Отримати список користувачів
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("_id email fullName role createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Помилка при отриманні користувачів",
      error: error.message,
    });
  }
});

// Створити користувача
router.post("/", async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({ message: "Користувач уже існує" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      fullName,
      role: role ?? "recruiter",
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Помилка при створенні користувача",
      error: error.message,
    });
  }
});

export default router;
