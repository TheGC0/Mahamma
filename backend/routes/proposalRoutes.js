import express from "express";
import {
  getProposalsByTask,
  getProposalById,
  createProposal,
  updateProposalStatus,
  deleteProposal,
} from "../controllers/proposalController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validateProposal } from "../middleware/validateMiddleware.js";

const router = express.Router({ mergeParams: true });

// Routes mounted under /api/tasks/:taskId/proposals
router
  .route("/")
  .get(protect, getProposalsByTask)
  .post(protect, requireRole("provider"), validateProposal, createProposal);

// Routes mounted under /api/proposals
const standaloneRouter = express.Router();

standaloneRouter.get("/:id", protect, getProposalById);
standaloneRouter.put("/:id/status", protect, requireRole("client"), updateProposalStatus);
standaloneRouter.delete("/:id", protect, requireRole("provider"), deleteProposal);

export { standaloneRouter };
export default router;
