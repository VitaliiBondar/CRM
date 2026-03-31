import express from "express";
import { Note } from "../models/note.model.js";

const router = express.Router();

// отримати нотатки кандидата
router.get("/:candidateId", async (req, res) => {
  try {
    const notes = await Note.find({
      candidateId: req.params.candidateId,
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// додати нотатку
router.post("/", async (req, res) => {
  try {
    const { candidateId, text } = req.body;

    const note = await Note.create({
      candidateId,
      text,
    });

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error creating note" });
  }
});

export default router;
