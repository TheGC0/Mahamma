import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  getAllUsers,
  updateUserVerification,
  getAllReports,
  createReport,
  updateReportStatus,
} from "../controllers/adminController.js";

const router = express.Router();

const adminOnly = [protect, requireRole("admin")];

router.get("/users", ...adminOnly, getAllUsers);
router.put("/users/:id/verify", ...adminOnly, updateUserVerification);

router.get("/reports", ...adminOnly, getAllReports);
router.post("/reports", protect, createReport);
router.put("/reports/:id/status", ...adminOnly, updateReportStatus);

export default router;
