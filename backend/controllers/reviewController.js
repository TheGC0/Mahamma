import Review from "../models/Review.js";
import Contract from "../models/Contract.js";
import Service from "../models/Service.js";
import ServiceOrder from "../models/ServiceOrder.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";

const toId = (value) => value?._id?.toString?.() || value?.toString?.() || "";

const averageScore = (scores) => {
  if (!scores.length) return 0;
  const average = scores.reduce((acc, score) => acc + score, 0) / scores.length;
  return Math.round(average * 10) / 10;
};

const recalculateUserRating = async (userId) => {
  const reviewedUserId = toId(userId);
  if (!reviewedUserId) return;

  const [contracts, serviceOrders] = await Promise.all([
    Contract.find({
      $or: [{ ClientID: reviewedUserId }, { ProviderID: reviewedUserId }],
      Status: "completed",
    })
      .select("_id")
      .lean(),
    ServiceOrder.find({
      $or: [{ ClientID: reviewedUserId }, { ProviderID: reviewedUserId }],
      Status: "completed",
    })
      .select("_id")
      .lean(),
  ]);

  const contractIds = contracts.map((contract) => contract._id);
  const serviceOrderIds = serviceOrders.map((order) => order._id);
  const reviewFilters = [];

  if (contractIds.length) reviewFilters.push({ ContractID: { $in: contractIds } });
  if (serviceOrderIds.length) reviewFilters.push({ ServiceOrderID: { $in: serviceOrderIds } });

  const reviews = reviewFilters.length
    ? await Review.find({ $or: reviewFilters }).select("ReviewerID Score").lean()
    : [];
  const receivedScores = reviews
    .filter((review) => toId(review.ReviewerID) !== reviewedUserId)
    .map((review) => review.Score);

  await User.findByIdAndUpdate(reviewedUserId, {
    Rating: averageScore(receivedScores),
  });
};

const recalculateServiceRating = async (serviceId) => {
  const reviewedServiceId = toId(serviceId);
  if (!reviewedServiceId) return;

  const serviceOrders = await ServiceOrder.find({
    ServiceID: reviewedServiceId,
    Status: "completed",
  })
    .select("_id")
    .lean();

  const serviceOrderIds = serviceOrders.map((order) => order._id);
  const reviews = serviceOrderIds.length
    ? await Review.find({ ServiceOrderID: { $in: serviceOrderIds } }).select("Score").lean()
    : [];

  await Service.findByIdAndUpdate(reviewedServiceId, {
    AverageRating: averageScore(reviews.map((review) => review.Score)),
    ReviewCount: reviews.length,
  });
};

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

    const serviceOrders = await ServiceOrder.find({
      ServiceID: service._id,
      Status: "completed",
    }).select("_id");

    const serviceOrderIds = serviceOrders.map((order) => order._id);
    const reviews = await Review.find({ ServiceOrderID: { $in: serviceOrderIds } })
      .populate("ReviewerID", "Name Rating")
      .populate("ServiceOrderID", "ServiceID ClientID ProviderID")
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
    const [contracts, serviceOrders] = await Promise.all([
      Contract.find({
        ProviderID: req.params.providerId,
        Status: "completed",
      }).select("_id"),
      ServiceOrder.find({
        ProviderID: req.params.providerId,
        Status: "completed",
      }).select("_id"),
    ]);

    const contractIds = contracts.map((contract) => contract._id);
    const serviceOrderIds = serviceOrders.map((order) => order._id);
    const reviews = await Review.find({
      $or: [
        { ContractID: { $in: contractIds }, ReviewerID: { $ne: req.params.providerId } },
        { ServiceOrderID: { $in: serviceOrderIds }, ReviewerID: { $ne: req.params.providerId } },
      ],
    })
      .populate("ReviewerID", "Name Rating")
      .populate("ContractID", "TaskID ClientID ProviderID")
      .populate("ServiceOrderID", "ServiceID ClientID ProviderID")
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

    const reviewedUserId =
      contract.ClientID.toString() === req.user._id.toString()
        ? contract.ProviderID
        : contract.ClientID;

    await recalculateUserRating(reviewedUserId);

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

// @desc    Create a review for a completed service order
// @route   POST /api/service-orders/:orderId/reviews
// @access  Private (client only)
export const createServiceOrderReview = async (req, res, next) => {
  try {
    const order = await ServiceOrder.findById(req.params.orderId)
      .populate("ServiceID", "Title")
      .populate("ClientID", "Name")
      .populate("ProviderID", "Name");

    if (!order) {
      res.status(404);
      throw new Error("Service order not found");
    }

    const orderStatus = (order.Status || "").toLowerCase();

    if (!["delivered", "completed"].includes(orderStatus)) {
      res.status(400);
      throw new Error("Can only review a delivered or completed service order");
    }

    if (toId(order.ClientID) !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only the client can review this service order");
    }

    const alreadyReviewed = await Review.findOne({
      ServiceOrderID: req.params.orderId,
      ReviewerID: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this service order");
    }

    const { Score, Comment } = req.body;
    const completedByReview = orderStatus !== "completed";

    if (completedByReview) {
      order.Status = "completed";
      await order.save();
    }

    const review = await Review.create({
      ServiceOrderID: req.params.orderId,
      ReviewerID: req.user._id,
      Score,
      Comment: Comment || "",
    });

    await Promise.all([
      recalculateUserRating(order.ProviderID),
      recalculateServiceRating(order.ServiceID),
    ]);

    const populated = await review.populate("ReviewerID", "Name");

    if (completedByReview) {
      await createNotification({
        userId: order.ProviderID._id,
        type: "contract",
        title: "Service order completed",
        description: `"${order.ServiceID.Title}" was approved by the client.`,
        actionUrl: "/provider/dashboard",
        metadata: {
          serviceOrderId: order._id,
          serviceId: order.ServiceID._id,
          status: "completed",
        },
      });
    }

    await createNotification({
      userId: order.ProviderID._id,
      type: "review",
      title: "New service review received",
      description: `${req.user.Name} left a ${Score}-star review for "${order.ServiceID.Title}".`,
      actionUrl: `/services/${order.ServiceID._id}`,
      metadata: {
        serviceOrderId: order._id,
        serviceId: order.ServiceID._id,
        reviewId: review._id,
        score: Score,
      },
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a service order
// @route   GET /api/service-orders/:orderId/reviews
// @access  Private (client/provider party)
export const getReviewsByServiceOrder = async (req, res, next) => {
  try {
    const order = await ServiceOrder.findById(req.params.orderId);

    if (!order) {
      res.status(404);
      throw new Error("Service order not found");
    }

    const isParty =
      order.ClientID.toString() === req.user._id.toString() ||
      order.ProviderID.toString() === req.user._id.toString();

    if (!isParty && req.user.Role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to view these reviews");
    }

    const reviews = await Review.find({
      ServiceOrderID: req.params.orderId,
    }).populate("ReviewerID", "Name Rating");

    res.json(reviews);
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
      .populate("ContractID", "TaskID ClientID ProviderID")
      .populate("ServiceOrderID", "ServiceID ClientID ProviderID");

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

    let reviewedUserId = null;
    let reviewedServiceId = null;

    if (review.ContractID) {
      const contract = await Contract.findById(review.ContractID);
      if (contract) {
        reviewedUserId =
          contract.ClientID.toString() === review.ReviewerID.toString()
            ? contract.ProviderID
            : contract.ClientID;
      }
    }

    if (review.ServiceOrderID) {
      const order = await ServiceOrder.findById(review.ServiceOrderID);
      if (order) {
        reviewedUserId = order.ProviderID;
        reviewedServiceId = order.ServiceID;
      }
    }

    await review.deleteOne();

    await Promise.all([
      reviewedUserId ? recalculateUserRating(reviewedUserId) : Promise.resolve(),
      reviewedServiceId ? recalculateServiceRating(reviewedServiceId) : Promise.resolve(),
    ]);

    res.json({ message: "Review removed" });
  } catch (error) {
    next(error);
  }
};
