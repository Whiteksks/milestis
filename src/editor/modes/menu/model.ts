import { MENU_CURRENCIES, MENU_LIMITS, type MenuContent, type MenuCurrency, type MenuDish } from './content-types'

export function createMenuContent(): MenuContent {
  return { venue: { name: '', description: '', currency: 'KZT' }, categories: [], dishes: [] }
}

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

export function visibleMenuCategories(content: MenuContent) {
  return content.categories.filter((category) => category.visible).map((category) => ({
    ...category,
    dishes: content.dishes.filter((dish) => dish.categoryId === category.id && dish.visible && dish.name.trim() && dish.priceMinor !== null),
  })).filter((category) => category.name.trim() && category.dishes.length > 0)
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}
function text(value: unknown, max: number): string { return typeof value === 'string' ? value.slice(0, max) : '' }
function validId(value: unknown): value is string { return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(value) }

/** Normalize saved drafts; never use another project's content as a fallback. */
export function normalizeMenuContent(value: unknown): MenuContent {
  const raw = record(value)
  const venue = record(raw.venue)
  const seen = new Set<string>()
  const categories = (Array.isArray(raw.categories) ? raw.categories : []).flatMap((entry) => {
    const category = record(entry)
    if (!validId(category.id) || seen.has(category.id)) return []
    seen.add(category.id)
    return [{ id: category.id, name: text(category.name, MENU_LIMITS.name), visible: category.visible !== false }]
  }).slice(0, MENU_LIMITS.categories)
  const categoryIds = new Set(categories.map((category) => category.id))
  const dishIds = new Set<string>()
  const dishes = (Array.isArray(raw.dishes) ? raw.dishes : []).flatMap((entry) => {
    const dish = record(entry)
    if (!validId(dish.id) || dishIds.has(dish.id) || typeof dish.categoryId !== 'string' || !categoryIds.has(dish.categoryId)) return []
    dishIds.add(dish.id)
    return [{
      id: dish.id, categoryId: dish.categoryId, name: text(dish.name, MENU_LIMITS.name),
      description: text(dish.description, MENU_LIMITS.description), visible: dish.visible !== false,
      priceMinor: typeof dish.priceMinor === 'number' && Number.isSafeInteger(dish.priceMinor) && dish.priceMinor >= 0 && dish.priceMinor <= MENU_LIMITS.priceMinor ? dish.priceMinor : null,
    }]
  }).slice(0, MENU_LIMITS.dishes)
  return {
    venue: {
      name: text(venue.name, MENU_LIMITS.name), description: text(venue.description, MENU_LIMITS.description),
      currency: MENU_CURRENCIES.includes(venue.currency as MenuCurrency) ? venue.currency as MenuCurrency : 'KZT',
    }, categories, dishes,
  }
}
