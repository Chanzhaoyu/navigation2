import { ExternalLink, Copy, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NavItem } from '@/types'
import { navCategories } from '@/data/mockData'
import { useState, useEffect } from 'react'

interface SimpleNavCardProps {
  item: NavItem
}

export function SimpleNavCard({ item }: SimpleNavCardProps) {
  const category = navCategories.find(cat => cat.id === item.category)
  const [isFavorited, setIsFavorited] = useState(false)
  
  // 检查是否已收藏
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorited(favorites.includes(item.id))
  }, [item.id])
  
  const handleVisit = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(item.url)
    // 这里可以添加一个 toast 提示
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    if (isFavorited) {
      // 取消收藏
      const newFavorites = favorites.filter((id: string) => id !== item.id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
      setIsFavorited(false)
    } else {
      // 添加收藏
      const newFavorites = [...favorites, item.id]
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
      setIsFavorited(true)
    }
  }

  return (
    <div className="group relative bg-card rounded-xl border p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-[200px] flex flex-col">
      {/* Private indicator */}
      {item.isPrivate && (
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="text-xs">
            私人
          </Badge>
        </div>
      )}

      {/* Favicon and Title - Centered */}
      <div className="text-center mb-auto">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center">
          {item.favicon ? (
            <img 
              src={item.favicon} 
              alt={`${item.title} favicon`}
              className="w-10 h-10 rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <span className={`text-lg font-bold ${item.favicon ? 'hidden' : ''}`}>
            {item.title[0]?.toUpperCase()}
          </span>
        </div>
        
        <h3 className="font-semibold text-sm mb-2 truncate">{item.title}</h3>
        
        {category && (
          <Badge variant="secondary" className="text-xs">
            {category.name}
          </Badge>
        )}
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-muted-foreground text-center mb-4 line-clamp-2 flex-shrink-0">
          {item.description}
        </p>
      )}

      {/* Actions - Always visible on hover */}
      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
        <Button
          size="sm"
          onClick={handleVisit}
          className="flex-1 text-xs h-8"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          访问
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="px-2 h-8"
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant={isFavorited ? "default" : "outline"}
          onClick={handleFavorite}
          className="px-2 h-8"
          title={isFavorited ? "取消收藏" : "添加收藏"}
        >
          <Heart className={`w-3 h-3 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Click overlay */}
      <div 
        className="absolute inset-0 rounded-xl"
        onClick={handleVisit}
      />
    </div>
  )
}
