import type { StateCreator } from 'zustand'
import type { ContentStore } from '@/editor/lib/store/content'
import type { ImageValue } from '@/editor/image/data'
import { MENU_LIMITS, type MenuContent, type MenuCategory, type MenuDish, type MenuVisibility, type MenuImageContent } from './content-types'
import { canRemoveMenuCategory, createMenuContent, moveMenuDish, moveMenuEntry, normalizeMenuContent } from './model'

export interface MenuSlice {
  menuContent: MenuContent
  menuVisibility: MenuVisibility
  menuImages: MenuImageContent
  updateMenuVenue: (updates: Partial<MenuContent['venue']>) => void
  addMenuCategory: () => void
  updateMenuCategory: (id: string, updates: Partial<Pick<MenuCategory, 'name' | 'visible'>>) => void
  removeMenuCategory: (id: string) => void
  moveMenuCategory: (id: string, direction: -1 | 1) => void
  addMenuDish: (categoryId: string) => void
  updateMenuDish: (id: string, updates: Partial<Omit<MenuDish, 'id'>>) => void
  removeMenuDish: (id: string) => void
  moveMenuDish: (id: string, direction: -1 | 1) => void
  setMenuImage: (dishId: string | null, image?: ImageValue) => void
  toggleMenuSection: (section: keyof MenuVisibility) => void
}

export const createMenuSlice: StateCreator<ContentStore, [], [], MenuSlice> = (set) => ({
  menuContent: createMenuContent(),
  menuVisibility: { showVenue: true, showMenu: true },
  menuImages: { dishes: {} },
  updateMenuVenue: (updates) => set((s) => ({ menuContent: normalizeMenuContent({ ...s.menuContent, venue: { ...s.menuContent.venue, ...updates } }) })),
  addMenuCategory: () => set((s) => s.menuContent.categories.length >= MENU_LIMITS.categories ? s : ({
    menuContent: { ...s.menuContent, categories: [...s.menuContent.categories, { id: crypto.randomUUID(), name: '', visible: true }] },
  })),
  updateMenuCategory: (id, updates) => set((s) => ({ menuContent: normalizeMenuContent({
    ...s.menuContent, categories: s.menuContent.categories.map((category) => category.id === id ? { ...category, ...updates } : category),
  }) })),
  removeMenuCategory: (id) => set((s) => !canRemoveMenuCategory(s.menuContent, id) ? s : ({
    menuContent: { ...s.menuContent, categories: s.menuContent.categories.filter((category) => category.id !== id) },
  })),
  moveMenuCategory: (id, direction) => set((s) => ({ menuContent: { ...s.menuContent, categories: moveMenuEntry(s.menuContent.categories, id, direction) } })),
  addMenuDish: (categoryId) => set((s) => s.menuContent.dishes.length >= MENU_LIMITS.dishes || !s.menuContent.categories.some((c) => c.id === categoryId) ? s : ({
    menuContent: { ...s.menuContent, dishes: [...s.menuContent.dishes, { id: crypto.randomUUID(), categoryId, name: '', description: '', priceMinor: null, visible: true }] },
  })),
  updateMenuDish: (id, updates) => set((s) => {
    if (updates.categoryId !== undefined && !s.menuContent.categories.some((c) => c.id === updates.categoryId)) return s
    return { menuContent: normalizeMenuContent({ ...s.menuContent, dishes: s.menuContent.dishes.map((dish) => dish.id === id ? { ...dish, ...updates } : dish) }) }
  }),
  removeMenuDish: (id) => set((s) => {
    const dishes = { ...s.menuImages.dishes }
    delete dishes[id]
    return { menuContent: { ...s.menuContent, dishes: s.menuContent.dishes.filter((dish) => dish.id !== id) }, menuImages: { ...s.menuImages, dishes } }
  }),
  moveMenuDish: (id, direction) => set((s) => ({ menuContent: { ...s.menuContent, dishes: moveMenuDish(s.menuContent.dishes, id, direction) } })),
  setMenuImage: (dishId, image) => set((s) => {
    if (dishId === null) return { menuImages: { ...s.menuImages, logo: image } }
    if (!s.menuContent.dishes.some((dish) => dish.id === dishId)) return s
    const dishes = { ...s.menuImages.dishes }
    if (image?.asset.src) dishes[dishId] = image
    else delete dishes[dishId]
    return { menuImages: { ...s.menuImages, dishes } }
  }),
  toggleMenuSection: (section) => set((s) => ({ menuVisibility: { ...s.menuVisibility, [section]: !s.menuVisibility[section] } })),
})
