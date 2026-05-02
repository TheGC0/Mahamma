import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    ConversationID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Conversation",
    },
    SenderID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Body: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
    ReadBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ ConversationID: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
