import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    fromStatus: {
      type: String,
      enum: ["in_work", "documents", "vlk", "enrolled", "declined"],
      default: null,
    },
    toStatus: {
      type: String,
      enum: ["in_work", "documents", "vlk", "enrolled", "declined"],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["in_work", "documents", "vlk", "enrolled", "declined"],
      default: "in_work",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Candidate = mongoose.model("Candidate", candidateSchema);
