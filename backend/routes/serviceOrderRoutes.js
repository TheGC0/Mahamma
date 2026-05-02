import express from "express";
import {
  getMyServiceOrders,
  updateServiceOrderStatus,
} from "../controllers/serviceOrderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyServiceOrders);
router.patch("/:id/status", protect, updateServiceOrderStatus);

export default router;
