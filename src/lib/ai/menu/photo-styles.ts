export const FOOD_PHOTO_STYLES = ['eveningWood', 'daylightCeramic', 'darkSlate'] as const
export type FoodPhotoStyle = typeof FOOD_PHOTO_STYLES[number]

export function isFoodPhotoStyle(value: unknown): value is FoodPhotoStyle {
  return typeof value === 'string' && FOOD_PHOTO_STYLES.some((style) => style === value)
}
