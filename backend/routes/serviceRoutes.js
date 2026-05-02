import express from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validateService } from "../middleware/validateMiddleware.js";
import { getReviewsByService } from "../controllers/reviewController.js";

const router = express.Router();

router
  .route("/")
  .get(getServices)
  .post(protect, requireRole("provider"), validateService, createService);

router
  .route("/:id")
  .get(getServiceById)
  .put(protect, updateService)
  .delete(protect, deleteService);

// Reviews nested under service
router.get("/:serviceId/reviews", getReviewsByService);

export default router;
