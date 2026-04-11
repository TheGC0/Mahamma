/**
 * Notification Usage Examples for Mahamma Platform
 *
 * This file contains practical examples of how to use the notification system
 * in different parts of the application.
 */

import { notify } from "./notifications.tsx";

// ============================================================================
// CLIENT NOTIFICATIONS
// ============================================================================

/**
 * When a client posts a new task
 */
export const notifyTaskPosted = (taskTitle) => {
  notify.success("تم نشر المهمة بنجاح!", {
    description: taskTitle,
    action: {
      label: "عرض المهمة",
      onClick: () => {
        // Navigate to task details
        window.location.href = "/client/dashboard";
      },
    },
  });
};

/**
 * When a client receives a new offer
 */
export const notifyNewOfferReceived = (providerName, amount, taskTitle) => {
  notify.newOffer(providerName, taskTitle);
};

/**
 * When a client accepts an offer
 */
export const notifyOfferAccepted = (providerName, taskTitle) => {
  notify.success("تم قبول العرض", {
    description: `تم قبول عرض ${providerName} على "${taskTitle}"`,
    duration: 5000,
  });
};

/**
 * When a task is delivered
 */
export const notifyTaskDelivered = (taskTitle, orderId) => {
  notify.orderUpdate("delivered", orderId);
};

// ============================================================================
// PROVIDER NOTIFICATIONS
// ============================================================================

/**
 * When a provider's offer is accepted
 */
export const notifyProviderOfferAccepted = (clientName, taskTitle) => {
  notify.taskAccepted(clientName);
};

/**
 * When a provider submits work
 */
export const notifyWorkSubmitted = (taskTitle) => {
  notify.success("تم تسليم العمل", {
    description: `تم تسليم "${taskTitle}" بنجاح`,
    action: {
      label: "عرض التفاصيل",
      onClick: () => {
        // Navigate to job workspace
      },
    },
  });
};

/**
 * When a provider creates a new service
 */
export const notifyServiceCreated = (serviceName) => {
  notify.success("تم إنشاء الخدمة!", {
    description: serviceName,
    action: {
      label: "عرض الخدمة",
      onClick: () => {
        window.location.href = "/provider/dashboard";
      },
    },
  });
};

/**
 * When a provider receives payment
 */
export const notifyProviderPaymentReceived = (amount, taskTitle) => {
  notify.paymentReceived(amount);
};

// ============================================================================
// MESSAGING NOTIFICATIONS
// ============================================================================

/**
 * When a new message is received
 */
export const notifyNewMessageReceived = (senderName, messagePreview) => {
  notify.newMessage(senderName, messagePreview);
};

/**
 * When a file is sent in chat
 */
export const notifyFileSent = (fileName) => {
  notify.success("تم إرسال الملف", {
    description: fileName,
  });
};

// ============================================================================
// SYSTEM NOTIFICATIONS
// ============================================================================

/**
 * Profile update success
 */
export const notifyProfileUpdated = () => {
  notify.success("تم تحديث الملف الشخصي", {
    description: "تم حفظ التغييرات بنجاح",
  });
};

/**
 * Password changed
 */
export const notifyPasswordChanged = () => {
  notify.success("تم تغيير كلمة المرور", {
    description: "تم تحديث كلمة المرور بنجاح",
  });
};

/**
 * Email verification sent
 */
export const notifyVerificationEmailSent = (email) => {
  notify.info("تم إرسال رابط التحقق", {
    description: `تم إرسال رابط التحقق إلى ${email}`,
    duration: 6000,
  });
};

/**
 * Account verification completed
 */
export const notifyAccountVerified = () => {
  notify.success("تم التحقق من الحساب!", {
    description: "حسابك الآن موثق ويمكنك استخدام جميع الميزات",
    duration: 5000,
  });
};

// ============================================================================
// ERROR NOTIFICATIONS
// ============================================================================

/**
 * Generic error handler
 */
export const notifyError = (message, details) => {
  notify.error(message, {
    description: details,
  });
};

/**
 * Network error
 */
export const notifyNetworkError = () => {
  notify.error("خطأ في الاتصال", {
    description: "يرجى التحقق من اتصال الإنترنت",
  });
};

/**
 * Validation error
 */
export const notifyValidationError = (field) => {
  notify.warning("خطأ في البيانات", {
    description: `يرجى التحقق من ${field}`,
  });
};

/**
 * Upload failed
 */
export const notifyUploadFailed = (fileName) => {
  notify.error("فشل رفع الملف", {
    description: fileName,
  });
};

// ============================================================================
// LOADING/PROMISE NOTIFICATIONS
// ============================================================================

/**
 * Example: Saving data with loading state
 */
export const saveDataWithNotification = async (saveFunction) => {
  return notify.promise(saveFunction(), {
    loading: "جاري الحفظ...",
    success: "تم الحفظ بنجاح!",
    error: "فشل الحفظ، يرجى المحاولة مرة أخرى",
  });
};

/**
 * Example: Uploading file with loading state
 */
export const uploadFileWithNotification = async (uploadFunction, fileName) => {
  return notify.promise(uploadFunction(), {
    loading: `جاري رفع ${fileName}...`,
    success: `تم رفع ${fileName} بنجاح!`,
    error: `فشل رفع ${fileName}`,
  });
};

/**
 * Example: Deleting item with loading state
 */
export const deleteItemWithNotification = async (deleteFunction, itemName) => {
  return notify.promise(deleteFunction(), {
    loading: `جاري حذف ${itemName}...`,
    success: `تم حذف ${itemName} بنجاح!`,
    error: `فشل حذف ${itemName}`,
  });
};

// ============================================================================
// PAYMENT NOTIFICATIONS
// ============================================================================

/**
 * Payment initiated
 */
export const notifyPaymentInitiated = (amount) => {
  notify.info("جاري معالجة الدفع", {
    description: `المبلغ: ${amount} ريال`,
  });
};

/**
 * Payment successful
 */
export const notifyPaymentSuccess = (amount, orderId) => {
  notify.success("تم الدفع بنجاح!", {
    description: `المبلغ: ${amount} ريال - رقم الطلب: ${orderId}`,
    duration: 6000,
  });
};

/**
 * Payment failed
 */
export const notifyPaymentFailed = (reason) => {
  notify.error("فشل الدفع", {
    description: reason || "يرجى المحاولة مرة أخرى أو استخدام طريقة دفع أخرى",
    duration: 6000,
  });
};

// ============================================================================
// REVIEW/RATING NOTIFICATIONS
// ============================================================================

/**
 * Review submitted
 */
export const notifyReviewSubmitted = () => {
  notify.success("تم إرسال التقييم", {
    description: "شكراً لمشاركة رأيك!",
  });
};

/**
 * Review received
 */
export const notifyReviewReceived = (rating, reviewerName) => {
  const stars = "⭐".repeat(rating);
  notify.notification(`تقييم جديد من ${reviewerName}`, stars);
};

// ============================================================================
// ADMIN NOTIFICATIONS
// ============================================================================

/**
 * User reported
 */
export const notifyUserReported = (userName) => {
  notify.warning("تم استلام البلاغ", {
    description: `سيتم مراجعة البلاغ على ${userName}`,
  });
};

/**
 * Content approved
 */
export const notifyContentApproved = (contentType) => {
  notify.success("تمت الموافقة", {
    description: `تمت الموافقة على ${contentType}`,
  });
};

/**
 * Content rejected
 */
export const notifyContentRejected = (contentType, reason) => {
  notify.error("تم الرفض", {
    description: `${contentType}: ${reason}`,
    duration: 6000,
  });
};
