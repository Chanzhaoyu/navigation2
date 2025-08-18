import { useState, useMemo } from 'react'
import { NavCard } from './NavCard'
import { SearchBar } from './SearchBar'
import { CategoryFilter } from './CategoryFilter'
import type { NavItem } from '@/types'

interface NavGridProps {
  items: NavItem[]
  title: string
  onEdit?: (item: NavItem) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function NavGrid({ items, title, onEdit, onDelete, showActions = false }: NavGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === null || item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [items, searchTerm, selectedCategory])

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="搜索导航..."
        />
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || selectedCategory ? '没有找到匹配的导航项' : '暂无导航项'}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <NavCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </div>
  )
}
