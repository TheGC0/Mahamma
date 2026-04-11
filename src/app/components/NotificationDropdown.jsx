import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#F7931E] p-0 flex items-center justify-center text-xs">
            2
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          <Button variant="ghost" className="text-xs h-auto p-0 text-[#F7931E] hover:text-[#F7931E]/80">Mark all as read</Button>
        </div>
        
        <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer focus:bg-gray-50">
          <div className="flex justify-between w-full mb-1">
            <span className="text-sm font-medium text-gray-900">New Offer Received</span>
            <span className="text-xs text-gray-500">5m ago</span>
          </div>
          <span className="text-xs text-gray-600 line-clamp-2">A provider has made an offer of 150 SAR on your task &quot;Fix broken pipe&quot;.</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer focus:bg-gray-50 border-t">
          <div className="flex justify-between w-full mb-1">
            <span className="text-sm font-medium text-gray-900">Task Completed</span>
            <span className="text-xs text-gray-500">2h ago</span>
          </div>
          <span className="text-xs text-gray-600 line-clamp-2">&quot;Assemble IKEA Furniture&quot; has been marked as completed. Please leave a review.</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer focus:bg-gray-50 border-t opacity-60">
          <div className="flex justify-between w-full mb-1">
            <span className="text-sm font-medium text-gray-700">Welcome to Mahamma!</span>
            <span className="text-xs text-gray-500">1d ago</span>
          </div>
          <span className="text-xs text-gray-500 line-clamp-2">Get started by browsing services or posting your first task.</span>
        </DropdownMenuItem>

        <div className="p-2 border-t text-center hover:bg-gray-50 transition-colors cursor-pointer rounded-b-md">
          <span className="text-sm text-gray-500 font-medium">View All Notifications</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
