import { Link, useNavigate } from "@tanstack/react-router";
import { User, Settings, LogOut, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { AppCenterDialog, CalendarDialog } from "./AppDialogs";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground text-lg font-bold">
                    N
                  </span>
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-xl">导航站</div>
                  <div className="text-xs text-muted-foreground -mt-1">
                    Navigation Hub
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Function Buttons */}
              <div className="hidden md:flex items-center gap-1">
                <AppCenterDialog />
                <CalendarDialog />
                <ThemeToggle />
              </div>

              {/* User Menu or Login */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-sm font-semibold">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <div className="flex items-center justify-start gap-3 p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm font-semibold">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/profile">
                        <User className="mr-3 h-4 w-4" />
                        个人资料
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Settings className="mr-3 h-4 w-4" />
                        管理面板
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      退出登录
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild>
                  <Link to="/login">登录</Link>
                </Button>
              )}

              {/* Mobile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Settings className="mr-3 h-4 w-4" />
                          管理面板
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/nav">
                          <Plus className="mr-3 h-4 w-4" />
                          添加导航
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem>
                    <AppCenterDialog />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CalendarDialog />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ThemeToggle />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
