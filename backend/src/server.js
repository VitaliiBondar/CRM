import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import candidateRoutes from "./routes/candidateRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notes.routes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend works" });
});

const PORT = process.env.PORT || 5050;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
