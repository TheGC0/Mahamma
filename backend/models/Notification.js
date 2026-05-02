import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Type: {
      type: String,
      required: true,
      enum: ["message", "proposal", "contract", "review", "system"],
      default: "system",
    },
    Title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    Description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    ActionUrl: {
      type: String,
      default: "",
      trim: true,
    },
    Read: {
      type: Boolean,
      default: false,
    },
    Metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ UserID: 1, Read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
