import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { navCategories } from '@/data/mockData'
import type { NavCategory } from '@/types'

export const Route = createFileRoute('/admin/categories')({
  component: CategoriesPage,
})

function CategoriesPage() {
  const [categories, setCategories] = useState<NavCategory[]>(navCategories)
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: 'blue',
  })

  const handleAddCategory = () => {
    if (!newCategory.name) return
    
    const category: NavCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color,
      order: categories.length + 1,
    }
    
    setCategories([...categories, category])
    setNewCategory({ name: '', description: '', color: 'blue' })
    setIsAdding(false)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id))
  }

  const colorOptions = [
    { value: 'blue', label: '蓝色', class: 'bg-blue-100 text-blue-800' },
    { value: 'purple', label: '紫色', class: 'bg-purple-100 text-purple-800' },
    { value: 'green', label: '绿色', class: 'bg-green-100 text-green-800' },
    { value: 'orange', label: '橙色', class: 'bg-orange-100 text-orange-800' },
    { value: 'pink', label: '粉色', class: 'bg-pink-100 text-pink-800' },
    { value: 'red', label: '红色', class: 'bg-red-100 text-red-800' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">分类管理</h1>
          <p className="text-muted-foreground">
            管理导航分类，组织您的网站收藏
          </p>
        </div>
        
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加分类
        </Button>
      </div>

      {/* 添加分类表单 */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>添加新分类</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">分类名称</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="输入分类名称"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">描述</label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="输入分类描述（可选）"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">颜色</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <Badge
                    key={color.value}
                    variant={newCategory.color === color.value ? 'default' : 'outline'}
                    className={`cursor-pointer ${newCategory.color === color.value ? '' : color.class}`}
                    onClick={() => setNewCategory(prev => ({ ...prev, color: color.value }))}
                  >
                    {color.label}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddCategory} disabled={!newCategory.name}>
                添加
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 分类列表 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const colorOption = colorOptions.find(c => c.value === category.color)
          return (
            <Card key={category.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={colorOption?.class}>
                    {colorOption?.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    排序: {category.order}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无分类</p>
        </div>
      )}
    </div>
  )
}
