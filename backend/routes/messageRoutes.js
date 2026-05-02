import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateMessage } from "../middleware/validateMiddleware.js";

const router = express.Router();

router
  .route("/conversations")
  .get(protect, getConversations)
  .post(protect, createConversation);

router
  .route("/conversations/:conversationId/messages")
  .get(protect, getMessages)
  .post(protect, validateMessage, sendMessage);

export default router;
