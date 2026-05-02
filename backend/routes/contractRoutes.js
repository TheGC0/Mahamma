import express from "express";
import {
  getMyContracts,
  getContractById,
  createContract,
  updateContractStatus,
} from "../controllers/contractController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { getReviewsByContract, createReview } from "../controllers/reviewController.js";
import { validateReview } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getMyContracts).post(protect, requireRole("client"), createContract);

router.route("/:id").get(protect, getContractById);
router.route("/:id/status").put(protect, updateContractStatus);

// Reviews nested under contracts
router
  .route("/:contractId/reviews")
  .get(protect, getReviewsByContract)
  .post(protect, validateReview, createReview);

export default router;
