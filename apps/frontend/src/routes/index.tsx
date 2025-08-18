import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { Search, SortAsc, SortDesc, Grid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SidebarCategories } from '@/components/SidebarCategories'
import { SimpleNavCard } from '@/components/SimpleNavCard'
import { useAuth } from '@/contexts/AuthContext'
import { publicNavItems, privateNavItems, navCategories } from '@/data/mockData'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [navType, setNavType] = useState<'public' | 'private'>('public')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  const currentNavItems = useMemo(() => {
    if (navType === 'public') {
      return publicNavItems
    } else {
      return user ? privateNavItems : []
    }
  }, [navType, user])

  const quickTags = [
    { name: 'GitHub', url: 'https://github.com', color: 'bg-gray-500' },
    { name: 'ChatGPT', url: 'https://chat.openai.com', color: 'bg-green-500' },
    { name: 'Google', url: 'https://google.com', color: 'bg-blue-500' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', color: 'bg-orange-500' },
    { name: 'MDN', url: 'https://developer.mozilla.org', color: 'bg-purple-500' },
    { name: 'npm', url: 'https://npmjs.com', color: 'bg-red-500' },
    { name: 'TypeScript', url: 'https://typescriptlang.org', color: 'bg-blue-600' },
    { name: 'React', url: 'https://react.dev', color: 'bg-cyan-500' }
  ]

  const filteredAndSortedItems = useMemo(() => {
    let filtered = currentNavItems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      if (selectedCategory === 'favorites') {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        return matchesSearch && favorites.includes(item.id)
      }

      const matchesCategory = selectedCategory === null || item.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title)
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [currentNavItems, searchTerm, selectedCategory, sortOrder])

  return (
    <div className="flex h-full overflow-hidden">
      <div className={`hidden lg:block border-r bg-muted/30 transition-all duration-300 overflow-y-auto ${
        sidebarCollapsed ? 'p-2' : 'p-6'
      }`}>
        <SidebarCategories
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          navType={navType}
          onNavTypeChange={setNavType}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索导航..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 w-full"
              />
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="h-10 px-3"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4 mr-2" />
                ) : (
                  <SortDesc className="w-4 h-4 mr-2" />
                )}
                A-Z
              </Button>

              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="h-10 px-3"
              >
                {viewMode === 'grid' ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {navType === 'public' && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-muted-foreground">快捷访问:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((tag, index) => (
                  <a
                    key={index}
                    href={tag.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-white hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: tag.color.replace('bg-', '').replace('-500', '').replace('-600', '') === 'gray' ? '#6b7280' : 
                      tag.color.includes('green') ? '#10b981' :
                      tag.color.includes('blue-600') ? '#2563eb' :
                      tag.color.includes('blue') ? '#3b82f6' :
                      tag.color.includes('orange') ? '#f97316' :
                      tag.color.includes('purple') ? '#8b5cf6' :
                      tag.color.includes('red') ? '#ef4444' :
                      tag.color.includes('cyan') ? '#06b6d4' : '#6b7280'
                    }}
                  >
                    {tag.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="lg:hidden mb-6">
            <SidebarCategories
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              className="w-full"
              compact={true}
              navType={navType}
              onNavTypeChange={setNavType}
            />
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Badge variant="secondary">
              {filteredAndSortedItems.length} 个导航
            </Badge>
            {selectedCategory && (
              <Badge variant="outline">
                {navCategories.find(c => c.id === selectedCategory)?.name}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="outline">
                搜索: "{searchTerm}"
              </Badge>
            )}
          </div>
        </div>

        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm || selectedCategory ? '没有找到匹配的导航项' : '暂无导航项'}
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
              : 'space-y-4'
          }>
            {filteredAndSortedItems.map((item) => (
              <SimpleNavCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {filteredAndSortedItems.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              加载更多
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
