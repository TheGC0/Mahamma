import Review from "../models/Review.js";
import Contract from "../models/Contract.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";

// @desc    Get all reviews for a service
// @route   GET /api/services/:serviceId/reviews
// @access  Public
export const getReviewsByService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    const contracts = await Contract.find({
      ProviderID: service.ProviderID,
      Status: "completed",
    }).select("_id");

    const contractIds = contracts.map((c) => c._id);
    const reviews = await Review.find({ ContractID: { $in: contractIds } })
      .populate("ReviewerID", "Name Rating")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews received by a provider
// @route   GET /api/reviews/provider/:providerId
// @access  Public
export const getReviewsByProvider = async (req, res, next) => {
  try {
    const contracts = await Contract.find({
      ProviderID: req.params.providerId,
      Status: "completed",
    }).select("_id");

    const contractIds = contracts.map((contract) => contract._id);
    const reviews = await Review.find({
      ContractID: { $in: contractIds },
      ReviewerID: { $ne: req.params.providerId },
    })
      .populate("ReviewerID", "Name Rating")
      .populate("ContractID", "TaskID ClientID ProviderID")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a contract
// @route   GET /api/contracts/:contractId/reviews
// @access  Private
export const getReviewsByContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.contractId);
    if (!contract) {
      res.status(404);
      throw new Error("Contract not found");
    }

    const isParty =
      contract.ClientID.toString() === req.user._id.toString() ||
      contract.ProviderID.toString() === req.user._id.toString();

    if (!isParty && req.user.Role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to view these reviews");
    }

    const reviews = await Review.find({
      ContractID: req.params.contractId,
    }).populate("ReviewerID", "Name");

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review for a completed contract
// @route   POST /api/contracts/:contractId/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.contractId);

    if (!contract) {
      res.status(404);
      throw new Error("Contract not found");
    }

    if (contract.Status !== "completed") {
      res.status(400);
      throw new Error("Can only review a completed contract");
    }

    const isParty =
      contract.ClientID.toString() === req.user._id.toString() ||
      contract.ProviderID.toString() === req.user._id.toString();

    if (!isParty) {
      res.status(403);
      throw new Error("Not authorized to review this contract");
    }

    const alreadyReviewed = await Review.findOne({
      ContractID: req.params.contractId,
      ReviewerID: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this contract");
    }

    const { Score, Comment } = req.body;

    const review = await Review.create({
      ContractID: req.params.contractId,
      ReviewerID: req.user._id,
      Score,
      Comment: Comment || "",
    });

    // Update the reviewed user's average rating
    const reviewedUserId =
      contract.ClientID.toString() === req.user._id.toString()
        ? contract.ProviderID
        : contract.ClientID;

    const allUserReviews = await Review.find({}).lean();

    // Find contracts where this user was reviewed
    const userContracts = await Contract.find({
      $or: [{ ClientID: reviewedUserId }, { ProviderID: reviewedUserId }],
      Status: "completed",
    }).select("_id");

    const contractIds = userContracts.map((c) => c._id.toString());
    const userReviews = allUserReviews.filter((r) =>
      contractIds.includes(r.ContractID.toString())
    );

    if (userReviews.length > 0) {
      const avgRating =
        userReviews.reduce((acc, r) => acc + r.Score, 0) / userReviews.length;
      await User.findByIdAndUpdate(reviewedUserId, {
        Rating: Math.round(avgRating * 10) / 10,
      });
    }

    const populated = await review.populate("ReviewerID", "Name");

    await createNotification({
      userId: reviewedUserId,
      type: "review",
      title: "New review received",
      description: `${req.user.Name} left you a ${Score}-star review.`,
      actionUrl:
        contract.ProviderID.toString() === reviewedUserId.toString()
          ? `/providers/${reviewedUserId}`
          : "/client/dashboard",
      metadata: {
        contractId: contract._id,
        reviewId: review._id,
        score: Score,
      },
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a review by ID
// @route   GET /api/reviews/:id
// @access  Public
export const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("ReviewerID", "Name Rating")
      .populate("ContractID", "TaskID ClientID ProviderID");

    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (reviewer or admin)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    if (
      review.ReviewerID.toString() !== req.user._id.toString() &&
      req.user.Role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized to delete this review");
    }

    await review.deleteOne();
    res.json({ message: "Review removed" });
  } catch (error) {
    next(error);
  }
};
