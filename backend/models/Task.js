import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    ClientID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    Description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },
    Budget: {
      type: Number,
      required: true,
      min: 1,
    },
    Category: {
      type: String,
      required: true,
      enum: [
        "Design",
        "Programming",
        "Video Editing",
        "Device Fixing",
        "Content Writing",
        "Translation",
        "Marketing",
        "Photography",
        "Tutoring",
        "Other",
      ],
    },
    Deadline: {
      type: Date,
    },
    Tags: {
      type: [String],
      default: [],
    },
    Status: {
      type: String,
      required: true,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
