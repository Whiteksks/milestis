import type { ImageValue } from '@/editor/image/data'

export const MENU_LIMITS = { categories: 30, dishes: 200, name: 100, description: 1000, priceMinor: 999999999 } as const
export const MENU_CURRENCIES = ['KZT', 'USD', 'EUR', 'RUB', 'GBP'] as const
export type MenuCurrency = (typeof MENU_CURRENCIES)[number]

export interface MenuCategory { id: string; name: string; visible: boolean }
export interface MenuDish {
  id: string
  categoryId: string
  name: string
  description: string
  priceMinor: number | null
  visible: boolean
}
// Array order is the single source of truth for display order.
export interface MenuContent {
  venue: { name: string; description: string; currency: MenuCurrency }
  categories: MenuCategory[]
  dishes: MenuDish[]
}
export interface MenuVisibility { showVenue: boolean; showMenu: boolean }
export interface MenuImageContent { logo?: ImageValue; dishes: Record<string, ImageValue> }
