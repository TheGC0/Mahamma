import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { notify } from "../lib/notifications.tsx";

/**
 * NotificationBell Component
 * Displays a bell icon with unread count and dropdown list of notifications
 */
export function NotificationBell() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "message",
      title: "رسالة جديدة من أحمد محمد",
      description: "مرحباً، أريد مناقشة تفاصيل المشروع",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionUrl: "/messages",
    },
    {
      id: "2",
      type: "offer",
      title: 'عرض جديد على "تصميم شعار"',
      description: "من سارة أحمد - 500 ريال",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      actionUrl: "/client/dashboard",
    },
    {
      id: "3",
      type: "order",
      title: "تحديث حالة الطلب #12345",
      description: "الحالة الجديدة: قيد التنفيذ",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "4",
      type: "payment",
      title: "تم استلام الدفعة",
      description: "500 ريال من خالد العلي",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    notify.success("تم مسح جميع الإشعارات");
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "الآن";
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
    return `منذ ${Math.floor(seconds / 86400)} يوم`;
  };

  const getNotificationIcon = (type) => {
    const iconClasses = "h-4 w-4";
    switch (type) {
      case "message":
        return <span className="text-2xl">💬</span>;
      case "offer":
        return <span className="text-2xl">💰</span>;
      case "order":
        return <span className="text-2xl">📦</span>;
      case "payment":
        return <span className="text-2xl">💵</span>;
      case "system":
        return <span className="text-2xl">🔔</span>;
      default:
        return <span className="text-2xl">🔔</span>;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="الإشعارات"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#F7931E] text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" dir="rtl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">الإشعارات</h3>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-7"
                >
                  تحديد الكل كمقروء
                </Button>
              )}
            </div>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.read ? "bg-[#F7931E]/5" : ""
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm ${!notification.read ? "font-semibold" : ""}`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="flex-shrink-0 h-2 w-2 bg-[#F7931E] rounded-full mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="w-full text-destructive hover:text-destructive"
            >
              مسح جميع الإشعارات
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
