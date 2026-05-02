import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    ProviderID: {
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
    Price: {
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
    DeliveryTime: {
      type: String,
      required: true,
    },
    Tags: {
      type: [String],
      default: [],
    },
    AverageRating: {
      type: Number,
      default: 0,
    },
    ReviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
