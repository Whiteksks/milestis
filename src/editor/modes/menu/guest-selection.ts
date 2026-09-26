import type { MenuContent, MenuDish } from './content-types'
import { visibleMenuCategories } from './model'

export type MenuSelection = Record<string, number>
export type MenuSelectionReaction = 'added' | 'removed'
export interface MenuSelectionInteraction {
  kind: MenuSelectionReaction
  dishId: string
  sequence: number
}

const MAX_QUANTITY = 99

/** Only IDs and quantities are stored. Names and prices always come from the current menu. */
export function readMenuSelection(value: unknown): MenuSelection {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).slice(0, 200).filter(([id, quantity]) =>
    id.length > 0 && id.length <= 80 && Number.isInteger(quantity) && (quantity as number) > 0 && (quantity as number) <= MAX_QUANTITY,
  ))
}

export function changeMenuSelection(selection: MenuSelection, dishId: string, delta: -1 | 1): MenuSelection {
  const quantity = Math.max(0, Math.min(MAX_QUANTITY, (selection[dishId] ?? 0) + delta))
  if (quantity === selection[dishId]) return selection
  if (quantity === 0) {
    const next = { ...selection }
    delete next[dishId]
    return next
  }
  return { ...selection, [dishId]: quantity }
}

export function availableMenuDishes(content: MenuContent): Map<string, MenuDish> {
  const dishes = new Map<string, MenuDish>()
  for (const page of content.pages) {
    for (const category of visibleMenuCategories(content, page.id)) {
      for (const dish of category.dishes) dishes.set(dish.id, dish)
    }
  }
  return dishes
}

export function resolveMenuSelection(selection: MenuSelection, content: MenuContent) {
  const available = availableMenuDishes(content)
  const items = Object.entries(selection).map(([id, quantity]) => ({ id, quantity, dish: available.get(id) ?? null }))
  return {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPriceMinor: items.reduce((sum, item) => sum + (item.dish?.priceMinor ?? 0) * item.quantity, 0),
  }
}
