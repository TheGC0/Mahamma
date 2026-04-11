import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  MessageCircle,
  DollarSign,
  FileCheck,
  Bell,
} from "lucide-react";

/**
 * Mahamma Notification System
 * Displays toast notifications with consistent styling matching the platform's brand
 */
export const notify = {
  /**
   * Show a success notification
   */
  success: (message, options) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      icon: <CheckCircle2 className="h-5 w-5 text-[#10b981]" />,
    });
  },

  /**
   * Show an error notification
   */
  error: (message, options) => {
    toast.error(message, {
      duration: options?.duration || 5000,
      description: options?.description,
      action: options?.action,
      icon: <XCircle className="h-5 w-5 text-destructive" />,
    });
  },

  /**
   * Show a warning notification
   */
  warning: (message, options) => {
    toast.warning(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      icon: <AlertTriangle className="h-5 w-5 text-[#F7931E]" />,
    });
  },

  /**
   * Show an info notification
   */
  info: (message, options) => {
    toast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      icon: <Info className="h-5 w-5 text-[#3b82f6]" />,
    });
  },

  /**
   * Show a custom notification without type styling
   */
  custom: (message, options) => {
    toast(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      icon: options?.icon,
    });
  },

  // Platform-specific notification shortcuts

  /**
   * New message notification
   */
  newMessage: (senderName, preview) => {
    toast(`رسالة جديدة من ${senderName}`, {
      duration: 5000,
      description: preview,
      icon: <MessageCircle className="h-5 w-5 text-[#F7931E]" />,
      action: {
        label: "View",
        onClick: () => {
          // Navigate to messages
          window.location.href = "/messages";
        },
      },
    });
  },

  /**
   * New offer notification
   */
  newOffer: (providerName, taskTitle) => {
    toast(`عرض جديد على "${taskTitle}"`, {
      duration: 5000,
      description: `من ${providerName}`,
      icon: <DollarSign className="h-5 w-5 text-[#10b981]" />,
      action: {
        label: "View Offers",
        onClick: () => {
          // Navigate to offers
          window.location.href = "/client-dashboard";
        },
      },
    });
  },

  /**
   * Order status update notification
   */
  orderUpdate: (status, orderId) => {
    const statusMessages = {
      "in-progress": { ar: "قيد التنفيذ", color: "#3b82f6" },
      delivered: { ar: "تم التسليم", color: "#F7931E" },
      completed: { ar: "مكتمل", color: "#10b981" },
      cancelled: { ar: "ملغي", color: "#d4183d" },
    };

    const statusInfo = statusMessages[status] || {
      ar: status,
      color: "#F7931E",
    };

    toast(`تحديث حالة الطلب #${orderId}`, {
      duration: 5000,
      description: `الحالة الجديدة: ${statusInfo.ar}`,
      icon: (
        <FileCheck className="h-5 w-5" style={{ color: statusInfo.color }} />
      ),
    });
  },

  /**
   * Task accepted notification
   */
  taskAccepted: (clientName) => {
    toast.success(`تم قبول عرضك!`, {
      duration: 5000,
      description: `${clientName} قبل عرضك`,
      icon: <CheckCircle2 className="h-5 w-5 text-[#10b981]" />,
    });
  },

  /**
   * Payment received notification
   */
  paymentReceived: (amount) => {
    toast.success(`تم استلام الدفعة`, {
      duration: 5000,
      description: `${amount} ريال`,
      icon: <DollarSign className="h-5 w-5 text-[#10b981]" />,
    });
  },

  /**
   * Generic notification bell
   */
  notification: (title, description) => {
    toast(title, {
      duration: 4000,
      description,
      icon: <Bell className="h-5 w-5 text-[#F7931E]" />,
    });
  },

  /**
   * Promise-based notification for async operations
   */
  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};

// Bilingual notification helpers
export const notifyBilingual = {
  success: (messageAr, messageEn, options) => {
    // For now, using Arabic. You can add language detection later
    notify.success(messageAr, options);
  },
  error: (messageAr, messageEn, options) => {
    notify.error(messageAr, options);
  },
  warning: (messageAr, messageEn, options) => {
    notify.warning(messageAr, options);
  },
  info: (messageAr, messageEn, options) => {
    notify.info(messageAr, options);
  },
};
