import { Button } from "./ui/button";
import {
  Bell,
  MessageSquare,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { useState } from "react";

export function Header({ isAuthenticated = false, userRole, userName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simple navigation handler that works with or without router
  const handleNavigate = (path) => {
    if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  const handleLogout = () => {
    handleNavigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-[#F7931E] rounded-lg p-2">
                <span className="text-white text-xl font-bold">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mahamma</h1>
                <p className="text-xs text-gray-500 -mt-1">مهمّة</p>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/services"
              className="text-sm text-gray-700 hover:text-[#F7931E] transition-colors"
            >
              Browse Services
            </a>
            <a
              href="/provider/tasks"
              className="text-sm text-gray-700 hover:text-[#F7931E] transition-colors"
            >
              Find Tasks
            </a>
            <a
              href="/client/post-task"
              className="text-sm text-gray-700 hover:text-[#F7931E] transition-colors"
            >
              Post a Task
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
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
                      <span className="text-xs text-gray-600 line-clamp-2">A provider has made an offer of 150 SAR on your task "Fix broken pipe".</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer focus:bg-gray-50 border-t">
                      <div className="flex justify-between w-full mb-1">
                        <span className="text-sm font-medium text-gray-900">Task Completed</span>
                        <span className="text-xs text-gray-500">2h ago</span>
                      </div>
                      <span className="text-xs text-gray-600 line-clamp-2">"Assemble IKEA Furniture" has been marked as completed. Please leave a review.</span>
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

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => handleNavigate("/messages")}
                >
                  <MessageSquare className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#F7931E] p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="bg-gray-200 rounded-full p-2">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="hidden md:inline text-sm">
                        {userName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() =>
                        handleNavigate(
                          userRole === "admin"
                            ? "/admin"
                            : userRole === "provider"
                              ? "/provider/dashboard"
                              : "/client/dashboard",
                        )
                      }
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleNavigate("/messages")}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate("/login")}
                  className="hidden sm:flex"
                >
                  Login
                </Button>
                <Button
                  onClick={() => handleNavigate("/signup")}
                  className="hidden sm:flex"
                >
                  Sign Up
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a
                href="/services"
                className="text-sm text-gray-700 hover:text-[#F7931E] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Services
              </a>
              <a
                href="/provider/tasks"
                className="text-sm text-gray-700 hover:text-[#F7931E] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Tasks
              </a>
              <a
                href="/client/post-task"
                className="text-sm text-gray-700 hover:text-[#F7931E] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Post a Task
              </a>
              {!isAuthenticated && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleNavigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      handleNavigate("/signup");
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start bg-[#F7931E] hover:bg-[#F7931E]/90"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
