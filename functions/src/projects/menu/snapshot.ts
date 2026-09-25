// Keep these limits aligned with editor/modes/menu/content-types.ts.
export class MenuPublishError extends Error {
  constructor(public readonly code: string, public readonly status = 400) { super(code); }
}

function record(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new MenuPublishError("INVALID_MENU");
  return value as Record<string, any>;
}
function text(value: unknown, max: number): string {
  if (typeof value !== "string" || value.length > max) throw new MenuPublishError("INVALID_MENU");
  return value.trim();
}
function id(value: unknown): string {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(value)) throw new MenuPublishError("INVALID_MENU");
  return value;
}

function image(value: unknown) {
  const data = record(value);
  const asset = record(data.asset);
  if (typeof asset.src !== "string" || !asset.src || !Number.isFinite(asset.width) || asset.width < 0 || !Number.isFinite(asset.height) || asset.height < 0) throw new MenuPublishError("INVALID_IMAGE");
  if (data.crop) {
    const crop = record(data.crop);
    const rect = record(crop.rect);
    if (!["left", "top", "width", "height"].every((key) => typeof rect[key] === "number" && Number.isFinite(rect[key]) && rect[key] >= 0 && rect[key] <= 1) || !rect.width || !rect.height || typeof crop.ratio !== "string") throw new MenuPublishError("INVALID_IMAGE");
  }
  if (data.presentation && (typeof data.presentation !== "object" || (data.presentation.fit && !["cover", "contain"].includes(data.presentation.fit)))) throw new MenuPublishError("INVALID_IMAGE");
  return data;
}

/** Only visible, complete dishes enter the public document. Hidden drafts stay private. */
export function prepareMenuSnapshot(draft: unknown) {
  const data = record(draft);
  if (Buffer.byteLength(JSON.stringify(data)) > 700_000) throw new MenuPublishError("INVALID_MENU");
  const content = record(data.content);
  const menu = record(content.sectionContent);
  const venue = record(menu.venue);
  const name = text(venue.name, 100);
  if (!name) throw new MenuPublishError("VENUE_REQUIRED");
  if (!["KZT", "USD", "EUR", "RUB", "GBP"].includes(venue.currency)) throw new MenuPublishError("INVALID_MENU");
  if (!Array.isArray(menu.categories) || menu.categories.length > 30 || !Array.isArray(menu.dishes) || menu.dishes.length > 200) {
    throw new MenuPublishError("INVALID_MENU");
  }
  const categoryIds = new Set<string>();
  const categories = menu.categories.map((value: unknown) => {
    const category = record(value);
    const categoryId = id(category.id);
    if (categoryIds.has(categoryId) || typeof category.visible !== "boolean") throw new MenuPublishError("INVALID_MENU");
    categoryIds.add(categoryId);
    return { id: categoryId, name: text(category.name, 100), visible: category.visible };
  }).filter((category) => category.visible && category.name);
  const visibleCategoryIds = new Set(categories.map((category) => category.id));
  const dishIds = new Set<string>();
  const dishes = menu.dishes.map((value: unknown) => {
    const dish = record(value);
    const dishId = id(dish.id);
    if (dishIds.has(dishId) || !categoryIds.has(dish.categoryId) || typeof dish.visible !== "boolean") throw new MenuPublishError("INVALID_MENU");
    dishIds.add(dishId);
    if (dish.priceMinor !== null && (!Number.isInteger(dish.priceMinor) || dish.priceMinor < 0 || dish.priceMinor > 999999999)) throw new MenuPublishError("INVALID_MENU");
    return { id: dishId, categoryId: dish.categoryId as string, name: text(dish.name, 100), description: text(dish.description, 1000), priceMinor: dish.priceMinor as number | null, visible: dish.visible };
  }).filter((dish) => dish.visible && dish.name && dish.priceMinor !== null && visibleCategoryIds.has(dish.categoryId));
  const visibility = record(content.sectionVisibility);
  if (!dishes.length || visibility.showMenu === false) throw new MenuPublishError("EMPTY_MENU");
  const images = record(content.imageContent ?? {});
  const dishImages = record(images.dishes ?? {});
  const publicImages: Record<string, unknown> = {};
  for (const dish of dishes) if (dishImages[dish.id]) publicImages[dish.id] = image(dishImages[dish.id]);
  const theme = record(data.theme);
  return {
    theme: { ...theme, currentTemplateId: "menu-classic", customDecorations: [] },
    content: {
      sectionContent: { venue: { name, description: text(venue.description, 1000), currency: venue.currency as string }, categories: categories.filter((c) => dishes.some((d) => d.categoryId === c.id)), dishes },
      sectionVisibility: { showVenue: visibility.showVenue !== false, showMenu: true },
      imageContent: { ...(visibility.showVenue !== false && images.logo ? { logo: image(images.logo) } : {}), dishes: publicImages },
    },
  };
}
