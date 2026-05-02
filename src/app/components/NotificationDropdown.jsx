import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Briefcase,
  FileText,
  Info,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  clearNotifications,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../lib/api";

const formatTimeAgo = (value) => {
  const date = new Date(value);
  const diffMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

const getNotificationIcon = (type) => {
  const className = "h-4 w-4";

  switch (type) {
    case "message":
      return <MessageSquare className={`${className} text-[#F7931E]`} />;
    case "proposal":
      return <FileText className={`${className} text-blue-600`} />;
    case "contract":
      return <Briefcase className={`${className} text-green-600`} />;
    case "review":
      return <Star className={`${className} text-[#F7931E]`} />;
    default:
      return <Info className={`${className} text-gray-500`} />;
  }
};

export function NotificationDropdown() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.Read) {
        await markNotificationRead(notification._id);
      }
      await loadNotifications();
      if (notification.ActionUrl) navigate(notification.ActionUrl);
    } catch (err) {
      setError(err.message || "Failed to update notification.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch (err) {
      setError(err.message || "Failed to mark notifications as read.");
    }
  };

  const handleClearAll = async () => {
    try {
      await clearNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      setError(err.message || "Failed to clear notifications.");
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && loadNotifications()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-[#F7931E] p-0 px-1 flex items-center justify-center text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between gap-3 px-4 py-2 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              className="text-xs h-auto p-0 text-[#F7931E] hover:text-[#F7931E]/80"
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-red-600">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="mx-auto mb-3 h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                className={`flex items-start gap-3 p-3 cursor-pointer focus:bg-gray-50 ${
                  notification.Read ? "opacity-70" : "bg-orange-50/60"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mt-1 rounded-full bg-white p-2 shadow-sm">
                  {getNotificationIcon(notification.Type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex w-full justify-between gap-2">
                    <span className="truncate text-sm font-medium text-gray-900">
                      {notification.Title}
                    </span>
                    <span className="shrink-0 text-xs text-gray-500">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  {notification.Description && (
                    <p className="line-clamp-2 text-xs text-gray-600">
                      {notification.Description}
                    </p>
                  )}
                </div>
                {!notification.Read && (
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F7931E]" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t p-2 text-center">
            <Button
              variant="ghost"
              className="h-auto p-1 text-xs text-gray-500 hover:text-red-600"
              onClick={handleClearAll}
            >
              Clear notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
