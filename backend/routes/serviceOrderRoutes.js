import express from "express";
import {
  getMyServiceOrders,
  updateServiceOrderStatus,
} from "../controllers/serviceOrderController.js";
import {
  createServiceOrderReview,
  getReviewsByServiceOrder,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateReview } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyServiceOrders);
router.patch("/:id/status", protect, updateServiceOrderStatus);
router
  .route("/:orderId/reviews")
  .get(protect, getReviewsByServiceOrder)
  .post(protect, validateReview, createServiceOrderReview);

export default router;
