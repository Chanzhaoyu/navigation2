import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { publicNavItems, privateNavItems } from "@/data/mockData";
import type { NavItem } from "@/types";

export const Route = createFileRoute("/admin/nav")({
  component: NavManagement,
});

function NavManagement() {
  const [allNavItems, setAllNavItems] = useState<NavItem[]>([
    ...publicNavItems,
    ...privateNavItems,
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (item: NavItem) => {
    console.log("编辑导航:", item);
  };

  const handleDelete = (id: string) => {
    console.log("删除导航:", id);
    setAllNavItems((items) => items.filter((item) => item.id !== id));
  };

  const filteredItems = allNavItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">导航管理</h1>
          <p className="text-muted-foreground">管理您的所有导航项目</p>
        </div>

        <Button asChild>
          <a href="/admin/nav/new">
            <Plus className="mr-2 h-4 w-4" />
            添加导航
          </a>
        </Button>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索导航..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          过滤
        </Button>
      </div>

      {/* 导航网格 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            所有导航 ({filteredItems.length})
          </h2>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm ? "没有找到匹配的导航项" : "暂无导航项"}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="group relative">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.isPrivate ? "私人" : "公开"}</span>
                    <span>{item.addedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
