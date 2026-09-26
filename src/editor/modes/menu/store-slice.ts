import type { StateCreator } from 'zustand'
import type { ContentStore } from '@/editor/lib/store/content'
import type { ImageValue } from '@/editor/image/data'
import { MENU_LIMITS, type MenuContent, type MenuCategory, type MenuDish, type MenuVisibility, type MenuImageContent } from './content-types'
import { canRemoveMenuCategory, createMenuContent, moveMenuDish, moveMenuEntry, readMenuContent } from './model'
import { addMenuPage, updateMenuPage, removeMenuPage, setMenuPageCategory } from '../../../../functions/src/domain/menu/page-commands'
import { isMenuPrice } from '../../../../functions/src/domain/menu/content'

export interface MenuSlice {
  menuContent: MenuContent
  menuVisibility: MenuVisibility
  menuImages: MenuImageContent
  updateMenuMascot: (updates: Partial<MenuContent['mascot']>) => void
  updateMenuVenue: (updates: Partial<MenuContent['venue']>) => void
  addMenuPage: (name: string, path: string, background?: ImageValue) => string
  updateMenuPage: (id: string, updates: { name: string; path: string; makeHome?: boolean }, background?: ImageValue | null) => void
  removeMenuPage: (id: string) => void
  setMenuPageCategory: (pageId: string, categoryId: string, attached: boolean) => void
  addMenuCategory: (pageId: string, name?: string) => string | null
  updateMenuCategory: (id: string, updates: Partial<Pick<MenuCategory, 'name' | 'visible'>>) => void
  removeMenuCategory: (id: string) => void
  moveMenuCategory: (pageId: string, id: string, direction: -1 | 1) => void
  addMenuDish: (pageId: string, categoryId: string, details: Pick<MenuDish, 'name' | 'description' | 'priceMinor' | 'visible' | 'recommended'>, image?: ImageValue) => string | null
  saveMenuDish: (id: string, details: Omit<MenuDish, 'id'>, image?: ImageValue) => boolean
  updateMenuDish: (id: string, updates: Partial<Omit<MenuDish, 'id'>>) => void
  removeMenuDish: (id: string) => void
  moveMenuDish: (id: string, direction: -1 | 1) => void
  setMenuImage: (dishId: string | null, image?: ImageValue) => void
  toggleMenuSection: (section: keyof MenuVisibility) => void
}

export const createMenuSlice: StateCreator<ContentStore, [], [], MenuSlice> = (set) => ({
  menuContent: createMenuContent(),
  menuVisibility: { showVenue: true, showMenu: true },
  menuImages: { dishes: {}, pageBackgrounds: {} },
  updateMenuMascot: (updates) => set((s) => ({ menuContent: readMenuContent({ ...s.menuContent, mascot: { ...s.menuContent.mascot, ...updates } }) })),
  addMenuPage: (name, path, background) => {
    const id = crypto.randomUUID()
    set((s) => ({
      menuContent: addMenuPage(s.menuContent, { id, name, path }),
      ...(background?.asset.src ? { menuImages: { ...s.menuImages, pageBackgrounds: { ...s.menuImages.pageBackgrounds, [id]: background } } } : {}),
    }))
    return id
  },
  updateMenuPage: (id, updates, background) => set((s) => {
    const menuContent = updateMenuPage(s.menuContent, id, updates)
    if (background === undefined) return { menuContent }
    const pageBackgrounds = { ...s.menuImages.pageBackgrounds }
    if (background?.asset.src) pageBackgrounds[id] = background
    else delete pageBackgrounds[id]
    return { menuContent, menuImages: { ...s.menuImages, pageBackgrounds } }
  }),
  removeMenuPage: (id) => set((s) => {
    const menuContent = removeMenuPage(s.menuContent, id)
    const pageBackgrounds = { ...s.menuImages.pageBackgrounds }
    delete pageBackgrounds[id]
    return { menuContent, menuImages: { ...s.menuImages, pageBackgrounds } }
  }),
  setMenuPageCategory: (pageId, categoryId, attached) => set((s) => {
    const menuContent = setMenuPageCategory(s.menuContent, pageId, categoryId, attached)
    return menuContent === s.menuContent ? s : { menuContent }
  }),
  updateMenuVenue: (updates) => set((s) => ({ menuContent: readMenuContent({ ...s.menuContent, venue: { ...s.menuContent.venue, ...updates } }) })),
  addMenuCategory: (pageId, name = '') => {
    const cleanName = name.trim()
    if (cleanName.length > MENU_LIMITS.name) return null
    const id = crypto.randomUUID()
    let created = false
    set((s) => {
      if (s.menuContent.categories.length >= MENU_LIMITS.categories || !s.menuContent.pages.some((page) => page.id === pageId)) return s
      created = true
      return { menuContent: {
        ...s.menuContent,
        categories: [...s.menuContent.categories, { id, name: cleanName, visible: true }],
        pages: s.menuContent.pages.map((page) => page.id === pageId
          ? { ...page, content: { categoryIds: [...page.content.categoryIds, id] } } : page),
      } }
    })
    return created ? id : null
  },
  updateMenuCategory: (id, updates) => set((s) => ({ menuContent: readMenuContent({
    ...s.menuContent, categories: s.menuContent.categories.map((category) => category.id === id ? { ...category, ...updates } : category),
  }) })),
  removeMenuCategory: (id) => set((s) => !canRemoveMenuCategory(s.menuContent, id) ? s : ({
    menuContent: {
      ...s.menuContent,
      categories: s.menuContent.categories.filter((category) => category.id !== id),
      pages: s.menuContent.pages.map((page) => ({ ...page, content: { categoryIds: page.content.categoryIds.filter((categoryId) => categoryId !== id) } })),
    },
  })),
  moveMenuCategory: (pageId, id, direction) => set((s) => ({ menuContent: {
    ...s.menuContent,
    pages: s.menuContent.pages.map((page) => page.id === pageId ? {
      ...page,
      content: { categoryIds: moveMenuEntry(page.content.categoryIds.map((id) => ({ id })), id, direction).map((entry) => entry.id) },
    } : page),
  } })),
  addMenuDish: (pageId, categoryId, details, image) => {
    const name = details.name.trim()
    const description = details.description.trim()
    if (!name || name.length > MENU_LIMITS.name || description.length > MENU_LIMITS.description || !isMenuPrice(details.priceMinor)) return null
    const id = crypto.randomUUID()
    let created = false
    set((s) => {
      if (s.menuContent.dishes.length >= MENU_LIMITS.dishes ||
        !s.menuContent.pages.some((page) => page.id === pageId && page.content.categoryIds.includes(categoryId))) return s
      created = true
      return {
        menuContent: { ...s.menuContent, dishes: [...s.menuContent.dishes, { id, categoryId, name, description, priceMinor: details.priceMinor, visible: details.visible, recommended: details.recommended === true }] },
        ...(image?.asset.src ? { menuImages: { ...s.menuImages, dishes: { ...s.menuImages.dishes, [id]: image } } } : {}),
      }
    })
    return created ? id : null
  },
  saveMenuDish: (id, details, image) => {
    const name = details.name.trim()
    const description = details.description.trim()
    if (!name || name.length > MENU_LIMITS.name || description.length > MENU_LIMITS.description || !isMenuPrice(details.priceMinor)) return false
    let saved = false
    set((s) => {
      if (!s.menuContent.dishes.some((dish) => dish.id === id) || !s.menuContent.categories.some((category) => category.id === details.categoryId)) return s
      const dishes = { ...s.menuImages.dishes }
      if (image?.asset.src) dishes[id] = image
      else delete dishes[id]
      saved = true
      return {
        menuContent: readMenuContent({ ...s.menuContent, dishes: s.menuContent.dishes.map((dish) => dish.id === id ? { ...dish, ...details, name, description } : dish) }),
        menuImages: { ...s.menuImages, dishes },
      }
    })
    return saved
  },
  updateMenuDish: (id, updates) => set((s) => {
    if (updates.categoryId !== undefined && !s.menuContent.categories.some((c) => c.id === updates.categoryId)) return s
    return { menuContent: readMenuContent({ ...s.menuContent, dishes: s.menuContent.dishes.map((dish) => dish.id === id ? { ...dish, ...updates } : dish) }) }
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
