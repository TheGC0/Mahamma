import Notification from "../models/Notification.js";

export const createNotification = async ({
  userId,
  type = "system",
  title,
  description = "",
  actionUrl = "",
  metadata = {},
}) => {
  if (!userId || !title) return null;

  return Notification.create({
    UserID: userId,
    Type: type,
    Title: title,
    Description: description,
    ActionUrl: actionUrl,
    Metadata: metadata,
  });
};
