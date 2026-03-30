import express from "express";
import { Candidate } from "../models/Candidate.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Отримати всіх кандидатів з фільтрами
router.get("/", async (req, res) => {
  try {
    const { month, status, position, unit, minAge, maxAge } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (position) {
      filter.position = position;
    }

    if (unit) {
      filter.unit = unit;
    }

    if (minAge || maxAge) {
      filter.age = {};

      if (minAge) {
        filter.age.$gte = Number(minAge);
      }

      if (maxAge) {
        filter.age.$lte = Number(maxAge);
      }
    }

    if (month) {
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      filter.dateOfContact = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });

    res.json(candidates);
  } catch (error) {
    res.status(500).json({
      message: "Помилка при отриманні кандидатів",
      error: error.message,
    });
  }
});

// Отримати одного кандидата
router.get("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Кандидата не знайдено" });
    }

    res.json(candidate);
  } catch (error) {
    res.status(500).json({
      message: "Помилка при отриманні кандидата",
      error: error.message,
    });
  }
});

// Створити кандидата
router.post("/", async (req, res) => {
  try {
    const initialStatus = req.body.status ?? "in_work";

    const candidate = await Candidate.create({
      ...req.body,
      dateOfEnrollment:
        initialStatus === "enrolled"
          ? req.body.dateOfEnrollment || new Date()
          : null,
      statusHistory: [
        {
          fromStatus: null,
          toStatus: initialStatus,
          changedAt: new Date(),
        },
      ],
    });

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
    const existingCandidate = await Candidate.findById(req.params.id);

    if (!existingCandidate) {
      return res.status(404).json({ message: "Кандидата не знайдено" });
    }

    const previousStatus = existingCandidate.status;
    const nextStatus = req.body.status ?? existingCandidate.status;

    Object.assign(existingCandidate, req.body);

    if (nextStatus !== previousStatus) {
      existingCandidate.statusHistory.push({
        fromStatus: previousStatus,
        toStatus: nextStatus,
        changedAt: new Date(),
      });
    }

    // Автоматична логіка дати зарахування
    if (nextStatus === "enrolled") {
      if (!existingCandidate.dateOfEnrollment) {
        existingCandidate.dateOfEnrollment = new Date();
      }
    } else {
      existingCandidate.dateOfEnrollment = null;
    }

    await existingCandidate.save();

    res.json(existingCandidate);
  } catch (error) {
    res.status(400).json({
      message: "Помилка при оновленні кандидата",
      error: error.message,
    });
  }
});

// Видалити кандидата
router.delete("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Кандидата не знайдено" });
    }

    res.json({ message: "Кандидата видалено" });
  } catch (error) {
    res.status(400).json({
      message: "Помилка при видаленні кандидата",
      error: error.message,
    });
  }
});

export default router;
