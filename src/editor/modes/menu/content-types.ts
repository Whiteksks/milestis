import type { ImageValue } from '@/editor/image/data'

export { MENU_LIMITS, MENU_CURRENCIES } from '../../../../functions/src/domain/menu/content'
export type { MenuContent, MenuCurrency, MenuCategory, MenuDish, MenuPage, MenuPageContent } from '../../../../functions/src/domain/menu/content'
export interface MenuVisibility { showVenue: boolean; showMenu: boolean }
export interface MenuImageContent { logo?: ImageValue; dishes: Record<string, ImageValue>; pageBackgrounds: Record<string, ImageValue> }
