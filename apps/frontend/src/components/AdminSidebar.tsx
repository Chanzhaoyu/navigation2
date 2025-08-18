import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Navigation,
  User,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigation = [
  {
    name: "仪表板",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "导航管理",
    href: "/admin/nav",
    icon: Navigation,
  },
  {
    name: "分类管理",
    href: "/admin/categories",
    icon: BookOpen,
  },
  {
    name: "统计分析",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

const settingsNavigation = [
  {
    name: "个人资料",
    href: "/admin/profile",
    icon: User,
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-muted/30 border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">管理面板</h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "bg-secondary")}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          );
        })}

        <Separator className="my-4" />

        {settingsNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "bg-secondary")}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
