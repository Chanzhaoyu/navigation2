import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { navCategories } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Heart, Globe, Lock } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarCategoriesProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  className?: string;
  compact?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  navType?: 'public' | 'private';
  onNavTypeChange?: (type: 'public' | 'private') => void;
}

export function SidebarCategories({
  selectedCategory,
  onCategoryChange,
  className,
  compact = false,
  collapsed = false,
  onToggleCollapse,
  navType = 'public',
  onNavTypeChange,
}: SidebarCategoriesProps) {
  const { user } = useAuth();

  // 保存折叠状态到localStorage
  useEffect(() => {
    if (onToggleCollapse) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
    }
  }, [collapsed, onToggleCollapse]);

  if (compact) {
    return (
      <div className={cn("space-y-4", className)}>
        {/* 导航类型选择器 - 移动端Tab样式 */}
        {user && (
          <div className="bg-muted/50 p-1 rounded-lg">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => onNavTypeChange?.('public')}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  navType === 'public'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span>公共导航</span>
                </span>
              </button>
              <button
                onClick={() => onNavTypeChange?.('private')}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  navType === 'private'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Lock className="h-4 w-4" />
                  <span>私人导航</span>
                </span>
              </button>
            </div>
          </div>
        )}
        
        {/* 分类选择器 */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => onCategoryChange(null)}
          >
            全部
          </Badge>
          {user && (
            <Badge
              variant={
                selectedCategory === "favorites" ? "default" : "secondary"
              }
              className="cursor-pointer"
              onClick={() => onCategoryChange(selectedCategory === "favorites" ? null : "favorites")}
            >
              ❤️ 收藏
            </Badge>
          )}
          {navCategories.map((category) => (
            <Badge
              key={category.id}
              variant={
                selectedCategory === category.id ? "default" : "secondary"
              }
              className="cursor-pointer"
              onClick={() => onCategoryChange(selectedCategory === category.id ? null : category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        collapsed ? "w-16" : "w-64",
        "transition-all duration-300 flex flex-col h-full",
        className
      )}
    >
      {/* 分类内容 */}
      <div className="flex-1">
        <div className="sticky top-4">
          {/* 导航类型选择器 */}
          <div className="mb-4">
            {collapsed ? (
              // 折叠状态：垂直排列的图标按钮
              <div className="space-y-1">
                <Button
                  variant={navType === 'public' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavTypeChange?.('public')}
                  className="w-full px-2 justify-center"
                  title="公共导航"
                >
                  <Globe className="h-4 w-4" />
                </Button>
                <Button
                  variant={navType === 'private' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavTypeChange?.('private')}
                  className="w-full px-2 justify-center"
                  title="私人导航"
                >
                  <Lock className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // 展开状态：Tab样式
              <div className="bg-muted/50 p-1 rounded-lg">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => onNavTypeChange?.('public')}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                      navType === 'public'
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Globe className="h-4 w-4" />
                      <span>公共</span>
                    </span>
                  </button>
                  <button
                    onClick={() => onNavTypeChange?.('private')}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                      navType === 'private'
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Lock className="h-4 w-4" />
                      <span>私人</span>
                    </span>
                  </button>
                </div>
              </div>
            )}
            
            {/* 分隔线 */}
            <div className="border-t my-4" />
          </div>

          <div className="space-y-2">
            <Button
              variant={selectedCategory === null ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(null)}
              className={cn(
                "w-full justify-start",
                collapsed && "px-2 justify-center"
              )}
              title={collapsed ? "全部分类" : undefined}
            >
              {collapsed ? "全" : "全部分类"}
            </Button>

            {navCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() =>
                  onCategoryChange(
                    selectedCategory === category.id ? null : category.id
                  )
                }
                className={cn(
                  "w-full",
                  collapsed ? "px-2 justify-center" : "justify-between"
                )}
                title={collapsed ? category.name : undefined}
              >
                <span className={collapsed ? "text-xs" : ""}>
                  {collapsed ? category.name[0] : category.name}
                </span>
                {!collapsed && (
                  <Badge variant="secondary" className="ml-2">
                    {category.id === "1"
                      ? "6"
                      : category.id === "2"
                      ? "4"
                      : category.id === "3"
                      ? "3"
                      : category.id === "4"
                      ? "2"
                      : "1"}
                  </Badge>
                )}
              </Button>
            ))}

            {/* 收藏分类 - 只有登录用户才显示 */}
            {user && (
              <>
                {/* 分隔线 */}
                <div className="border-t my-2" />

                <Button
                  variant={
                    selectedCategory === "favorites" ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() =>
                    onCategoryChange(
                      selectedCategory === "favorites" ? null : "favorites"
                    )
                  }
                  className={cn(
                    "w-full",
                    collapsed ? "px-2 justify-center" : "justify-between"
                  )}
                  title={collapsed ? "收藏" : undefined}
                >
                  {collapsed ? (
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        selectedCategory === "favorites" ? "fill-current" : ""
                      )}
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Heart
                          className={cn(
                            "h-4 w-4",
                            selectedCategory === "favorites"
                              ? "fill-current"
                              : ""
                          )}
                        />
                        <span>收藏</span>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        3
                      </Badge>
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 底部折叠按钮 - 简化为右下角按钮 */}
      <div className="p-2 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
          title={collapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
