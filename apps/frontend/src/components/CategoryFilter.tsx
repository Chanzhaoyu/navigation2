import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { navCategories } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      green: 'bg-green-100 text-green-800 hover:bg-green-200',
      orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
      red: 'bg-red-100 text-red-800 hover:bg-red-200',
    }
    return colors[color] || 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant={selectedCategory === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="h-8"
      >
        全部
      </Button>
      {navCategories.map((category) => (
        <Badge
          key={category.id}
          variant="secondary"
          className={cn(
            'cursor-pointer transition-colors h-8 px-3 flex items-center',
            selectedCategory === category.id
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : getCategoryColor(category.color || 'gray')
          )}
          onClick={() => onCategoryChange(
            selectedCategory === category.id ? null : category.id
          )}
        >
          {category.name}
        </Badge>
      ))}
    </div>
  )
}
