import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = '搜索导航...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className={`relative flex items-center transition-all duration-200 ${
        isFocused ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-10 h-11 text-base"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange('')}
            className="absolute right-1 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
