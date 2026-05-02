import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    Participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    LastMessage: {
      type: String,
      default: "",
      trim: true,
    },
    LastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ Participants: 1, LastMessageAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
