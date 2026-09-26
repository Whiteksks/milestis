import { MENU_LIMITS, type MenuContent, type MenuDish } from './content-types'
export { createMenuContent, readMenuContent, menuPageCategories, visibleMenuCategories } from '../../../../functions/src/domain/menu/content'

/** No rounding or floating point multiplication: incomplete/invalid input stays invalid. */
export function parseMenuPrice(input: string): number | null {
  const value = input.trim().replace(',', '.')
  if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(value)) return null
  const [whole, fraction = ''] = value.split('.')
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  return Number.isSafeInteger(minor) && minor <= MENU_LIMITS.priceMinor ? minor : null
}

export function menuPriceInput(minor: number | null): string {
  return minor === null ? '' : `${Math.floor(minor / 100)}.${String(minor % 100).padStart(2, '0')}`
}

export function moveMenuEntry<T extends { id: string }>(items: T[], id: string, direction: -1 | 1): T[] {
  const index = items.findIndex((item) => item.id === id)
  const target = index + direction
  if (index < 0 || target < 0 || target >= items.length) return items
  const next = [...items]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export function moveMenuDish(dishes: MenuDish[], id: string, direction: -1 | 1): MenuDish[] {
  const index = dishes.findIndex((dish) => dish.id === id)
  if (index < 0) return dishes
  const indices = dishes.flatMap((dish, i) => dish.categoryId === dishes[index].categoryId ? [i] : [])
  const target = indices[indices.indexOf(index) + direction]
  if (target === undefined) return dishes
  const next = [...dishes]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export function canRemoveMenuCategory(content: MenuContent, id: string): boolean {
  return !content.dishes.some((dish) => dish.categoryId === id)
}
