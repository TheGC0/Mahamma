import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validateTask } from "../middleware/validateMiddleware.js";
import proposalRouter, { standaloneRouter as proposalStandaloneRouter } from "./proposalRoutes.js";

const router = express.Router();

router.route("/").get(getTasks).post(protect, requireRole("client"), validateTask, createTask);
router
  .route("/:id")
  .get(getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

// Nest proposals under tasks: /api/tasks/:taskId/proposals
router.use("/:taskId/proposals", proposalRouter);

export default router;
