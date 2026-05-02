import express from "express";
import {
  getReviewById,
  deleteReview,
  getReviewsByProvider,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/provider/:providerId", getReviewsByProvider);
router.get("/:id", getReviewById);
router.delete("/:id", protect, deleteReview);

export default router;
