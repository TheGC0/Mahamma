import Proposal from "../models/Proposal.js";
import Task from "../models/Task.js";

// @desc    Get all proposals for a task
// @route   GET /api/tasks/:taskId/proposals
// @access  Private
export const getProposalsByTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    // Only the task owner (client) or an admin can see all proposals
    if (
      task.ClientID.toString() !== req.user._id.toString() &&
      req.user.Role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized to view proposals for this task");
    }

    const proposals = await Proposal.find({ TaskID: req.params.taskId })
      .populate("FreelancerID", "Name Email Rating Major")
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single proposal by ID
// @route   GET /api/proposals/:id
// @access  Private
export const getProposalById = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate("FreelancerID", "Name Email Rating Major")
      .populate("TaskID", "Title Description Budget ClientID");

    if (!proposal) {
      res.status(404);
      throw new Error("Proposal not found");
    }

    const isOwner =
      proposal.FreelancerID._id.toString() === req.user._id.toString();
    const isTaskClient =
      proposal.TaskID.ClientID.toString() === req.user._id.toString();

    if (!isOwner && !isTaskClient && req.user.Role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to view this proposal");
    }

    res.json(proposal);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a proposal on a task
// @route   POST /api/tasks/:taskId/proposals
// @access  Private (provider only)
export const createProposal = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (task.Status !== "open") {
      res.status(400);
      throw new Error("Cannot submit a proposal on a task that is not open");
    }

    if (task.ClientID.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot submit a proposal on your own task");
    }

    const alreadyProposed = await Proposal.findOne({
      TaskID: req.params.taskId,
      FreelancerID: req.user._id,
    });

    if (alreadyProposed) {
      res.status(400);
      throw new Error("You have already submitted a proposal for this task");
    }

    const { BidAmount, EstimatedTime, CoverLetter } = req.body;

    const proposal = await Proposal.create({
      TaskID: req.params.taskId,
      FreelancerID: req.user._id,
      BidAmount,
      EstimatedTime,
      CoverLetter,
    });

    const populated = await proposal.populate(
      "FreelancerID",
      "Name Email Rating"
    );

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update proposal status (accept/reject) — client only
// @route   PUT /api/proposals/:id/status
// @access  Private (client who owns the task)
export const updateProposalStatus = async (req, res, next) => {
  try {
    const { Status } = req.body;

    if (!["accepted", "rejected"].includes(Status)) {
      res.status(400);
      throw new Error("Status must be 'accepted' or 'rejected'");
    }

    const proposal = await Proposal.findById(req.params.id).populate(
      "TaskID",
      "ClientID Status"
    );

    if (!proposal) {
      res.status(404);
      throw new Error("Proposal not found");
    }

    if (proposal.TaskID.ClientID.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this proposal");
    }

    proposal.Status = Status;
    const updated = await proposal.save();

    // When a proposal is accepted, reject all other proposals for the same task
    if (Status === "accepted") {
      await Proposal.updateMany(
        { TaskID: proposal.TaskID._id, _id: { $ne: proposal._id } },
        { Status: "rejected" }
      );
      await Task.findByIdAndUpdate(proposal.TaskID._id, {
        Status: "in_progress",
      });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a proposal
// @route   DELETE /api/proposals/:id
// @access  Private (proposal owner)
export const deleteProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      res.status(404);
      throw new Error("Proposal not found");
    }

    if (proposal.FreelancerID.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this proposal");
    }

    if (proposal.Status !== "pending") {
      res.status(400);
      throw new Error("Cannot delete a proposal that has already been reviewed");
    }

    await proposal.deleteOne();
    res.json({ message: "Proposal removed" });
  } catch (error) {
    next(error);
  }
};
