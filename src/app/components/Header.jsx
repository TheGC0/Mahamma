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
import { NotificationDropdown } from "./NotificationDropdown";
import { useNavigate } from "react-router";

export function Header({ isAuthenticated = false, userRole, userName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <img
                src="/logo_2.png"
                alt="Mahamma logo"
                className="h-10 w-10 rounded-lg object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mahamma</h1>
                <p className="text-xs text-gray-500 -mt-1">مهمّة</p>
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              type="button"
              onClick={() => handleNavigate("/services")}
              className="text-sm text-gray-700 hover:text-[#F7931E] transition-colors"
            >
              Browse Services
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("/provider/tasks")}
              className="text-sm text-gray-700 hover:text-[#F7931E] transition-colors"
            >
              Find Tasks
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("/client/post-task")}
              className="text-sm text-gray-700 hover:text-[#F7931E] transition-colors"
            >
              Post a Task
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />

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

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <button
                type="button"
                onClick={() => handleNavigate("/services")}
                className="text-sm text-left text-gray-700 hover:text-[#F7931E] transition-colors py-2"
              >
                Browse Services
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/provider/tasks")}
                className="text-sm text-left text-gray-700 hover:text-[#F7931E] transition-colors py-2"
              >
                Find Tasks
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/client/post-task")}
                className="text-sm text-left text-gray-700 hover:text-[#F7931E] transition-colors py-2"
              >
                Post a Task
              </button>

              {!isAuthenticated && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigate("/login")}
                    className="justify-start"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleNavigate("/signup")}
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