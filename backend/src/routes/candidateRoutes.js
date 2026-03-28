import express from "express";
import { Candidate } from "../models/Candidate.js";

const router = express.Router();

// Отримати всіх кандидатів
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Помилка при отриманні кандидатів" });
  }
});

// Створити кандидата
router.post("/", async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({
      message: "Помилка при створенні кандидата",
      error: error.message,
    });
  }
});

// Оновити кандидата
router.put("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!candidate) {
      return res.status(404).json({ message: "Кандидата не знайдено" });
    }

    res.json(candidate);
  } catch (error) {
    res.status(400).json({
      message: "Помилка при оновленні кандидата",
      error: error.message,
    });
  }
});

export default router;
