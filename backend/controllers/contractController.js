import Contract from "../models/Contract.js";
import Proposal from "../models/Proposal.js";
import Task from "../models/Task.js";
import { createNotification } from "../utils/createNotification.js";

// @desc    Get all contracts for the logged-in user
// @route   GET /api/contracts
// @access  Private
export const getMyContracts = async (req, res, next) => {
  try {
    const query =
      req.user.Role === "admin"
        ? {}
        : req.user.Role === "client"
        ? { ClientID: req.user._id }
        : { ProviderID: req.user._id };

    const contracts = await Contract.find(query)
      .populate("TaskID", "Title Description Category")
      .populate("ClientID", "Name Email")
      .populate("ProviderID", "Name Email Rating")
      .populate("ProposalID", "BidAmount EstimatedTime CoverLetter")
      .sort({ createdAt: -1 });

    res.json(contracts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get contract by ID
// @route   GET /api/contracts/:id
// @access  Private
export const getContractById = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate("TaskID", "Title Description Category Budget")
      .populate("ClientID", "Name Email")
      .populate("ProviderID", "Name Email Rating")
      .populate("ProposalID", "BidAmount EstimatedTime CoverLetter");

    if (!contract) {
      res.status(404);
      throw new Error("Contract not found");
    }

    const isParty =
      contract.ClientID._id.toString() === req.user._id.toString() ||
      contract.ProviderID._id.toString() === req.user._id.toString();

    if (!isParty && req.user.Role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to view this contract");
    }

    res.json(contract);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a contract from an accepted proposal
// @route   POST /api/contracts
// @access  Private (client only)
export const createContract = async (req, res, next) => {
  try {
    const { ProposalID, DeliveryDate, Deadline } = req.body;
    const requestedDeliveryDate = DeliveryDate || Deadline;

    if (!ProposalID || !requestedDeliveryDate) {
      res.status(400);
      throw new Error("ProposalID and DeliveryDate are required");
    }

    const proposal = await Proposal.findById(ProposalID).populate(
      "TaskID",
      "ClientID Status"
    );

    if (!proposal) {
      res.status(404);
      throw new Error("Proposal not found");
    }

    if (proposal.TaskID.ClientID.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to create a contract for this proposal");
    }

    if (proposal.Status !== "accepted") {
      res.status(400);
      throw new Error("Proposal must be accepted before creating a contract");
    }

    const existingContract = await Contract.findOne({ ProposalID });
    if (existingContract) {
      res.status(400);
      throw new Error("A contract already exists for this proposal");
    }

    const deliveryDate = new Date(requestedDeliveryDate);
    if (isNaN(deliveryDate.getTime()) || deliveryDate <= new Date()) {
      res.status(400);
      throw new Error("DeliveryDate must be a valid future date");
    }

    const contract = await Contract.create({
      ProposalID,
      TaskID: proposal.TaskID._id,
      ClientID: req.user._id,
      ProviderID: proposal.FreelancerID,
      AgreedAmount: proposal.BidAmount,
      DeliveryDate: deliveryDate,
    });

    const populated = await Contract.findById(contract._id)
      .populate("TaskID", "Title Description")
      .populate("ClientID", "Name Email")
      .populate("ProviderID", "Name Email")
      .populate("ProposalID", "BidAmount EstimatedTime");

    await createNotification({
      userId: contract.ProviderID,
      type: "contract",
      title: "New contract started",
      description: `A contract for "${populated.TaskID.Title}" has started.`,
      actionUrl: `/client/jobs/${contract._id}`,
      metadata: {
        contractId: contract._id,
        taskId: contract.TaskID,
      },
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update contract status
// @route   PUT /api/contracts/:id/status
// @access  Private (parties to the contract)
export const updateContractStatus = async (req, res, next) => {
  try {
    const { Status } = req.body;

    if (!["delivered", "completed", "cancelled"].includes(Status)) {
      res.status(400);
      throw new Error("Status must be 'delivered', 'completed', or 'cancelled'");
    }

    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      res.status(404);
      throw new Error("Contract not found");
    }

    const isParty =
      contract.ClientID.toString() === req.user._id.toString() ||
      contract.ProviderID.toString() === req.user._id.toString();

    if (!isParty && req.user.Role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to update this contract");
    }

    if (["completed", "cancelled"].includes(contract.Status)) {
      res.status(400);
      throw new Error("Completed or cancelled contracts cannot be updated");
    }

    if (Status === "delivered" && contract.Status !== "active") {
      res.status(400);
      throw new Error("Only active contracts can be marked as delivered");
    }

    if (Status === "completed" && !["active", "delivered"].includes(contract.Status)) {
      res.status(400);
      throw new Error("Only active or delivered contracts can be completed");
    }

    contract.Status = Status;
    const updated = await contract.save();

    if (Status === "completed") {
      await Task.findByIdAndUpdate(contract.TaskID, { Status: "completed" });
    } else if (Status === "cancelled") {
      await Task.findByIdAndUpdate(contract.TaskID, { Status: "cancelled" });
    }

    const otherUserId =
      contract.ClientID.toString() === req.user._id.toString()
        ? contract.ProviderID
        : contract.ClientID;

    await createNotification({
      userId: otherUserId,
      type: "contract",
      title:
        Status === "delivered"
          ? "Work delivered"
          : Status === "completed"
          ? "Contract completed"
          : "Contract cancelled",
      description:
        Status === "delivered"
          ? "A contract you are part of was marked delivered."
          : Status === "completed"
          ? "A contract you are part of was marked completed."
          : "A contract you are part of was cancelled.",
      actionUrl: `/client/jobs/${contract._id}`,
      metadata: {
        contractId: contract._id,
        status: Status,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
