import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  MessageCircle,
  DollarSign,
  X,
  Eye,
  ArrowRight,
  Clock,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function NotificationPopup({ notification, onClose }) {
  if (!notification) return null;

  const isMessage = notification.type === "message";
  const isOffer = notification.type === "offer";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="relative overflow-hidden border-2 shadow-2xl">
            {/* Header Color Bar */}
            <div
              className={`h-2 w-full ${
                isMessage ? "bg-[#F7931E]" : "bg-[#10b981]"
              }`}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Icon and Title */}
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    isMessage ? "bg-[#F7931E]/10" : "bg-[#10b981]/10"
                  }`}
                >
                  {isMessage ? (
                    <MessageCircle className="h-8 w-8 text-[#F7931E]" />
                  ) : (
                    <DollarSign className="h-8 w-8 text-[#10b981]" />
                  )}
                </div>

                <div className="flex-1 space-y-1 pt-1">
                  <h3 className="text-xl font-bold text-foreground">
                    {notification.title}
                  </h3>
                  {notification.titleEn && (
                    <p className="text-sm text-muted-foreground">
                      {notification.titleEn}
                    </p>
                  )}
                </div>
              </div>

              {/* Sender Info */}
              <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#F7931E] to-[#e8841a] flex items-center justify-center text-white font-bold text-lg">
                  {notification.senderAvatar ||
                    notification.senderName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {notification.senderName}
                  </p>
                  {notification.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#F7931E] text-[#F7931E]" />
                      <span className="text-sm font-medium">
                        {notification.rating}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {notification.timestamp}
                </div>
              </div>

              {/* Message Preview */}
              {isMessage && notification.preview && (
                <div className="bg-background border-2 border-border rounded-lg p-4">
                  <p className="text-sm text-foreground line-clamp-3">
                    {notification.preview}
                  </p>
                </div>
              )}

              {/* Offer Details */}
              {isOffer && (
                <div className="space-y-3">
                  {notification.taskTitle && (
                    <div className="bg-background border-2 border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        على المهمة / Task
                      </p>
                      <p className="font-semibold text-foreground">
                        {notification.taskTitle}
                      </p>
                    </div>
                  )}
                  {notification.amount && (
                    <div className="flex items-center justify-between bg-[#10b981]/10 border-2 border-[#10b981]/20 rounded-lg p-4">
                      <span className="text-sm text-muted-foreground">
                        قيمة العرض / Offer Amount
                      </span>
                      <span className="text-2xl font-bold text-[#10b981]">
                        {notification.amount} ريال
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => {
                    notification.onView?.();
                    onClose();
                  }}
                  className={`flex-1 ${
                    isMessage
                      ? "bg-[#F7931E] hover:bg-[#e8841a]"
                      : "bg-[#10b981] hover:bg-[#059669]"
                  } text-white`}
                >
                  <Eye className="h-4 w-4 ml-2" />
                  {isMessage ? "عرض الرسالة" : "عرض العرض"}
                  <span className="mx-2">/</span>
                  {isMessage ? "View Message" : "View Offer"}
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </div>

              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                size="sm"
              >
                تجاهل / Dismiss
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Demo Component to showcase the popup
export function NotificationPopupDemo() {
  const [activeNotification, setActiveNotification] = useState(null);

  const sampleNotifications = [
    {
      id: "1",
      type: "message",
      title: "رسالة جديدة",
      titleEn: "New Message",
      senderName: "أحمد محمد العلي",
      preview:
        "مرحباً، لقد اطلعت على مهمتك وأنا مهتم جداً بالعمل عليها. لدي خبرة 5 سنوات في هذا المجال وسأكون سعيداً بمناقشة التفاصيل معك.",
      timestamp: "منذ 5 دقائق",
      rating: 4.8,
      onView: () => console.log("Navigate to messages"),
    },
    {
      id: "2",
      type: "offer",
      title: "عرض جديد على مهمتك",
      titleEn: "New Offer on Your Task",
      senderName: "سارة أحمد الخالد",
      taskTitle: "تصميم شعار احترافي لشركة تقنية",
      amount: 500,
      timestamp: "منذ 10 دقائق",
      rating: 4.9,
      onView: () => console.log("Navigate to offers"),
    },
    {
      id: "3",
      type: "message",
      title: "رسالة جديدة",
      titleEn: "New Message",
      senderName: "خالد العتيبي",
      preview:
        "شكراً لك! تم استلام الملفات بنجاح. سأبدأ العمل فوراً وسأرسل لك النسخة الأولية خلال يومين.",
      timestamp: "منذ ساعة",
      rating: 5.0,
      onView: () => console.log("Navigate to messages"),
    },
    {
      id: "4",
      type: "offer",
      title: "عرض جديد على مهمتك",
      titleEn: "New Offer on Your Task",
      senderName: "نورة السالم",
      taskTitle: "تطوير موقع إلكتروني متكامل",
      amount: 2500,
      timestamp: "منذ 3 ساعات",
      rating: 4.7,
      onView: () => console.log("Navigate to offers"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            نوافذ الإشعارات المنبثقة
          </h1>
          <p className="text-xl text-muted-foreground">
            Notification Popup Design
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Click any notification below to see the popup in action
          </p>
        </div>

        {/* Notification Triggers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleNotifications.map((notif) => (
            <Card
              key={notif.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2"
              onClick={() => setActiveNotification(notif)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${
                    notif.type === "message"
                      ? "bg-[#F7931E]/10"
                      : "bg-[#10b981]/10"
                  }`}
                >
                  {notif.type === "message" ? (
                    <MessageCircle className="h-5 w-5 text-[#F7931E]" />
                  ) : (
                    <DollarSign className="h-5 w-5 text-[#10b981]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {notif.title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    من {notif.senderName}
                  </p>
                  {notif.type === "offer" && notif.amount && (
                    <p className="text-sm font-bold text-[#10b981] mt-1">
                      {notif.amount} ريال
                    </p>
                  )}
                  {notif.type === "message" && notif.preview && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {notif.preview}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {notif.timestamp}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Code Example */}
        <Card className="bg-gradient-to-br from-[#F7931E]/5 to-transparent p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#F7931E]" />
            Usage Example - مثال الاستخدام
          </h3>
          <div className="bg-black/90 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono">
              {`import { NotificationPopup } from './components/NotificationPopup';
import { useState } from 'react';

function MyComponent() {
  const [notification, setNotification] = useState(null);

  // Show message notification
  const showMessage = () => {
    setNotification({
      id: '1',
      type: 'message',
      title: 'رسالة جديدة',
      titleEn: 'New Message',
      senderName: 'أحمد محمد',
      preview: 'مرحباً، أريد مناقشة المشروع',
      timestamp: 'منذ 5 دقائق',
      rating: 4.8,
      onView: () => navigate('/messages'),
    });
  };

  // Show offer notification
  const showOffer = () => {
    setNotification({
      id: '2',
      type: 'offer',
      title: 'عرض جديد',
      titleEn: 'New Offer',
      senderName: 'سارة أحمد',
      taskTitle: 'تصميم شعار',
      amount: 500,
      timestamp: 'منذ 10 دقائق',
      rating: 4.9,
      onView: () => navigate('/offers'),
    });
  };

  return (
    <>
      <NotificationPopup
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </>
  );
}`}
            </pre>
          </div>
        </Card>

        {/* Features List */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Features - المميزات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#F7931E] mt-1.5" />
              <span>Animated entrance with spring physics</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#F7931E] mt-1.5" />
              <span>Bilingual support (Arabic/English)</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#F7931E] mt-1.5" />
              <span>Message & Offer notification types</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#F7931E] mt-1.5" />
              <span>Sender rating display</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#F7931E] mt-1.5" />
              <span>Backdrop blur effect</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#F7931E] mt-1.5" />
              <span>Click outside to dismiss</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#F7931E] mt-1.5" />
              <span>Mahamma brand colors</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#F7931E] mt-1.5" />
              <span>Responsive design</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Popup */}
      <NotificationPopup
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
      />
    </div>
  );
}
