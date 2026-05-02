import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";

const userFields = "Name Email Role Major Rating";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const isParticipant = (conversation, userId) =>
  conversation.Participants.some((participant) => {
    const participantId = participant._id || participant;
    return participantId.toString() === userId.toString();
  });

const populateConversation = (query) =>
  query.populate("Participants", userFields);

// @desc    Get conversations for the logged-in user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await populateConversation(
      Conversation.find({ Participants: req.user._id }).sort({
        LastMessageAt: -1,
        updatedAt: -1,
      })
    );

    const unreadCounts = await Message.aggregate([
      {
        $match: {
          ConversationID: { $in: conversations.map((c) => c._id) },
          SenderID: { $ne: req.user._id },
          ReadBy: { $ne: req.user._id },
        },
      },
      { $group: { _id: "$ConversationID", count: { $sum: 1 } } },
    ]);

    const unreadByConversation = unreadCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    res.json(
      conversations.map((conversation) => ({
        ...conversation.toObject(),
        UnreadCount: unreadByConversation[conversation._id.toString()] || 0,
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Create or return an existing conversation with another user
// @route   POST /api/messages/conversations
// @access  Private
export const createConversation = async (req, res, next) => {
  try {
    const { ParticipantID } = req.body;

    if (!ParticipantID || !isValidId(ParticipantID)) {
      res.status(400);
      throw new Error("A valid ParticipantID is required");
    }

    if (ParticipantID.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot start a conversation with yourself");
    }

    const participant = await User.findById(ParticipantID).select(userFields);
    if (!participant) {
      res.status(404);
      throw new Error("User not found");
    }

    let conversation = await Conversation.findOne({
      Participants: { $all: [req.user._id, ParticipantID], $size: 2 },
    });
    let wasCreated = false;

    if (!conversation) {
      conversation = await Conversation.create({
        Participants: [req.user._id, ParticipantID],
      });
      wasCreated = true;
    }

    const populated = await populateConversation(
      Conversation.findById(conversation._id)
    );

    res.status(wasCreated ? 201 : 200).json({
      ...populated.toObject(),
      UnreadCount: 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversations/:conversationId/messages
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    if (!isValidId(conversationId)) {
      res.status(400);
      throw new Error("Invalid conversation id");
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404);
      throw new Error("Conversation not found");
    }

    if (!isParticipant(conversation, req.user._id)) {
      res.status(403);
      throw new Error("Not authorized to view this conversation");
    }

    await Message.updateMany(
      {
        ConversationID: conversationId,
        SenderID: { $ne: req.user._id },
        ReadBy: { $ne: req.user._id },
      },
      { $addToSet: { ReadBy: req.user._id } }
    );

    const messages = await Message.find({ ConversationID: conversationId })
      .populate("SenderID", userFields)
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/messages/conversations/:conversationId/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { Body } = req.body;

    if (!isValidId(conversationId)) {
      res.status(400);
      throw new Error("Invalid conversation id");
    }

    if (!Body || Body.trim().length === 0) {
      res.status(400);
      throw new Error("Message body is required");
    }

    if (Body.trim().length > 2000) {
      res.status(400);
      throw new Error("Message body must be 2000 characters or less");
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404);
      throw new Error("Conversation not found");
    }

    if (!isParticipant(conversation, req.user._id)) {
      res.status(403);
      throw new Error("Not authorized to send messages in this conversation");
    }

    const message = await Message.create({
      ConversationID: conversationId,
      SenderID: req.user._id,
      Body: Body.trim(),
      ReadBy: [req.user._id],
    });

    conversation.LastMessage = message.Body;
    conversation.LastMessageAt = message.createdAt;
    await conversation.save();

    await Promise.all(
      conversation.Participants.filter(
        (participantId) => participantId.toString() !== req.user._id.toString()
      ).map((participantId) =>
        createNotification({
          userId: participantId,
          type: "message",
          title: `New message from ${req.user.Name}`,
          description: message.Body,
          actionUrl: `/messages?conversation=${conversationId}`,
          metadata: {
            conversationId,
            senderId: req.user._id,
          },
        })
      )
    );

    const populated = await Message.findById(message._id).populate(
      "SenderID",
      userFields
    );

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};
