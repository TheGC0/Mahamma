import Service from "../models/Service.js";
import ServiceOrder from "../models/ServiceOrder.js";
import { createNotification } from "../utils/createNotification.js";

const populateOrder = (query) =>
  query
    .populate("ServiceID", "Title Description Category Price DeliveryTime")
    .populate("ClientID", "Name Email Role")
    .populate("ProviderID", "Name Email Role Rating");

// @desc    Create an order for a listed service
// @route   POST /api/services/:serviceId/orders
// @access  Private (client only)
export const createServiceOrder = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.serviceId).populate(
      "ProviderID",
      "Name Email"
    );

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    if (service.ProviderID._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot order your own service");
    }

    const existingOrder = await ServiceOrder.findOne({
      ServiceID: service._id,
      ClientID: req.user._id,
      Status: { $in: ["pending", "active"] },
    });

    if (existingOrder) {
      res.status(400);
      throw new Error("You already have an active order for this service");
    }

    const order = await ServiceOrder.create({
      ServiceID: service._id,
      ClientID: req.user._id,
      ProviderID: service.ProviderID._id,
      Price: service.Price,
      DeliveryTime: service.DeliveryTime,
      Message: req.body.Message || "",
    });

    const populated = await populateOrder(ServiceOrder.findById(order._id));

    await createNotification({
      userId: service.ProviderID._id,
      type: "contract",
      title: "New service order",
      description: `${req.user.Name} ordered "${service.Title}" for ${service.Price} SAR.`,
      actionUrl: "/provider/dashboard",
      metadata: {
        serviceId: service._id,
        orderId: order._id,
        clientId: req.user._id,
      },
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get service orders for the logged-in user
// @route   GET /api/service-orders
// @access  Private
export const getMyServiceOrders = async (req, res, next) => {
  try {
    const query =
      req.user.Role === "admin"
        ? {}
        : req.user.Role === "provider"
        ? { ProviderID: req.user._id }
        : { ClientID: req.user._id };

    const orders = await populateOrder(
      ServiceOrder.find(query).sort({ createdAt: -1 })
    );

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update service order status
// @route   PATCH /api/service-orders/:id/status
// @access  Private (client/provider party)
export const updateServiceOrderStatus = async (req, res, next) => {
  try {
    const { Status } = req.body;

    if (!["active", "completed", "cancelled"].includes(Status)) {
      res.status(400);
      throw new Error("Status must be active, completed, or cancelled");
    }

    const order = await ServiceOrder.findById(req.params.id).populate(
      "ServiceID",
      "Title"
    );

    if (!order) {
      res.status(404);
      throw new Error("Service order not found");
    }

    const isClient = order.ClientID.toString() === req.user._id.toString();
    const isProvider = order.ProviderID.toString() === req.user._id.toString();

    if (!isClient && !isProvider && req.user.Role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to update this service order");
    }

    if (Status === "active" && !isProvider && req.user.Role !== "admin") {
      res.status(403);
      throw new Error("Only the provider can accept a service order");
    }

    if (Status === "completed" && !isClient && req.user.Role !== "admin") {
      res.status(403);
      throw new Error("Only the client can complete a service order");
    }

    order.Status = Status;
    const updated = await order.save();
    const populated = await populateOrder(ServiceOrder.findById(updated._id));

    const notifyUserId = isProvider ? order.ClientID : order.ProviderID;
    const titleByStatus = {
      active: "Service order accepted",
      completed: "Service order completed",
      cancelled: "Service order cancelled",
    };

    await createNotification({
      userId: notifyUserId,
      type: "contract",
      title: titleByStatus[Status],
      description: `"${order.ServiceID.Title}" is now ${Status}.`,
      actionUrl:
        notifyUserId.toString() === order.ProviderID.toString()
          ? "/provider/dashboard"
          : "/client/dashboard",
      metadata: {
        orderId: order._id,
        serviceId: order.ServiceID._id,
        status: Status,
      },
    });

    res.json(populated);
  } catch (error) {
    next(error);
  }
};
