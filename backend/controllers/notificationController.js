import Notification from "../models/Notification.js";

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ UserID: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      UserID: req.user._id,
      Read: false,
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark one notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, UserID: req.user._id },
      { Read: true },
      { returnDocument: "after" }
    );

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { UserID: req.user._id, Read: false },
      { Read: true }
    );

    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all notifications for the logged-in user
// @route   DELETE /api/notifications
// @access  Private
export const clearNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ UserID: req.user._id });
    res.json({ message: "Notifications cleared" });
  } catch (error) {
    next(error);
  }
};
