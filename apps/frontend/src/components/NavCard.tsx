import { ExternalLink, Lock, Calendar, Tag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { NavItem } from '@/types'
import { navCategories } from '@/data/mockData'

interface NavCardProps {
  item: NavItem
  onEdit?: (item: NavItem) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function NavCard({ item, onEdit, onDelete, showActions = false }: NavCardProps) {
  const category = navCategories.find(cat => cat.id === item.category)
  
  const handleVisit = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {item.favicon ? (
              <img 
                src={item.favicon} 
                alt={`${item.title} favicon`}
                className="w-6 h-6 rounded flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            ) : (
              <div className="w-6 h-6 bg-muted rounded flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base leading-tight truncate">
                {item.title}
                {item.isPrivate && (
                  <Lock className="inline ml-2 h-3 w-3 text-muted-foreground" />
                )}
              </CardTitle>
              {category && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {category.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {item.description && (
          <CardDescription className="mb-3 line-clamp-2">
            {item.description}
          </CardDescription>
        )}
        
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-2 h-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {item.addedAt.toLocaleDateString()}
          </div>
          
          <div className="flex gap-2">
            {showActions && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                编辑
              </Button>
            )}
            {showActions && onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
              >
                删除
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={handleVisit}
              className="opacity-90 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              访问
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
