export interface NavItem {
  id: string
  title: string
  description?: string
  url: string
  icon?: string
  category: string
  isPrivate: boolean
  tags: string[]
  favicon?: string
  addedAt: Date
  updatedAt: Date
}

export interface NavCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  order: number
}

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  isLoggedIn: boolean
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  layout: 'grid' | 'list'
  showDescriptions: boolean
  itemsPerPage: number
}

export interface AppConfig {
  siteName: string
  siteDescription: string
  version: string
  features: {
    registration: boolean
    publicNav: boolean
    privateNav: boolean
  }
}
