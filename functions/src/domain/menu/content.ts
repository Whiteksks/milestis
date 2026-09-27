import type { ProjectPage, ProjectPages } from "../pages";
import { readProjectPages } from "../pages";
import { createMenuMascotSettings, readMenuMascotSettings, type MenuMascotSettings } from './mascot';
import { ContentValidationError, readBoolean, readId, readList, readRecord, readText } from "../validation";

export const MENU_LIMITS = { categories: 30, dishes: 200, name: 100, description: 1000, priceMinor: 999999999 } as const;
export const MENU_CURRENCIES = ["KZT", "USD", "EUR", "RUB", "GBP"] as const;
export type MenuCurrency = (typeof MENU_CURRENCIES)[number];
export interface MenuCategory { id: string; name: string; visible: boolean }
export interface MenuDish {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceMinor: number | null;
  visible: boolean;
  recommended: boolean;
}
export interface MenuPageContent { categoryIds: string[] }
export type MenuPage = ProjectPage<MenuPageContent>;

export interface MenuContent extends ProjectPages<MenuPageContent> {
  mascot: MenuMascotSettings;
  venue: { name: string; description: string; currency: MenuCurrency };
  /** Shared catalog. A page owns its category order; dishes are ordered within their category. */
  categories: MenuCategory[];
  dishes: MenuDish[];
}

export function createMenuContent(): MenuContent {
  return {
    mascot: createMenuMascotSettings(),
    venue: { name: "", description: "", currency: "KZT" },
    categories: [], dishes: [],
    homePageId: "home",
    pages: [{ id: "home", name: "", path: "/", content: { categoryIds: [] } }],
  };
}

export function isMenuPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= MENU_LIMITS.priceMinor;
}

/** Incomplete text/prices are valid drafts. Broken structure is never silently discarded. */
export function readMenuContent(value: unknown): MenuContent {
  const raw = readRecord(value, "menu");
  const venue = readRecord(raw.venue, "venue");
  if (!MENU_CURRENCIES.includes(venue.currency as MenuCurrency)) throw new ContentValidationError("venue.currency");
  const categoryIds = new Set<string>();
  const categories = readList(raw.categories, "categories", MENU_LIMITS.categories).map((entry, index) => {
    const path = `categories.${index}`;
    const category = readRecord(entry, path);
    const id = readId(category.id, `${path}.id`);
    if (categoryIds.has(id)) throw new ContentValidationError(`${path}.id`);
    categoryIds.add(id);
    return { id, name: readText(category.name, `${path}.name`, MENU_LIMITS.name), visible: readBoolean(category.visible, `${path}.visible`) };
  });
  const dishIds = new Set<string>();
  const dishes = readList(raw.dishes, "dishes", MENU_LIMITS.dishes).map((entry, index) => {
    const path = `dishes.${index}`;
    const dish = readRecord(entry, path);
    const id = readId(dish.id, `${path}.id`);
    const categoryId = readId(dish.categoryId, `${path}.categoryId`);
    if (dishIds.has(id)) throw new ContentValidationError(`${path}.id`);
    if (!categoryIds.has(categoryId)) throw new ContentValidationError(`${path}.categoryId`);
    if (dish.priceMinor !== null && !isMenuPrice(dish.priceMinor)) throw new ContentValidationError(`${path}.priceMinor`);
    dishIds.add(id);
    return {
      id, categoryId,
      name: readText(dish.name, `${path}.name`, MENU_LIMITS.name),
      description: readText(dish.description, `${path}.description`, MENU_LIMITS.description),
      priceMinor: dish.priceMinor,
      visible: readBoolean(dish.visible, `${path}.visible`),
      recommended: dish.recommended === undefined ? false : readBoolean(dish.recommended, `${path}.recommended`),
    };
  });
  const pages = readProjectPages(raw.pages, raw.homePageId, (value, path): MenuPageContent => {
    const page = readRecord(value, path);
    const seen = new Set<string>();
    return { categoryIds: readList(page.categoryIds, `${path}.categoryIds`, MENU_LIMITS.categories).map((entry, index) => {
      const location = `${path}.categoryIds.${index}`;
      const id = readId(entry, location);
      if (!categoryIds.has(id) || seen.has(id)) throw new ContentValidationError(location);
      seen.add(id);
      return id;
    }) };
  });
  return {
    mascot: readMenuMascotSettings(raw.mascot),
    venue: {
      name: readText(venue.name, "venue.name", MENU_LIMITS.name),
      description: readText(venue.description, "venue.description", MENU_LIMITS.description),
      currency: venue.currency as MenuCurrency,
    },
    categories, dishes, ...pages,
  };
}

export function menuPageCategories(content: MenuContent, pageId = content.homePageId): MenuCategory[] {
  const page = content.pages.find((entry) => entry.id === pageId);
  const categories = new Map(content.categories.map((category) => [category.id, category]));
  return (page?.content.categoryIds ?? []).flatMap((id) => {
    const category = categories.get(id);
    return category ? [category] : [];
  });
}

export function visibleMenuCategories(content: MenuContent, pageId = content.homePageId) {
  return menuPageCategories(content, pageId).filter((category) => category.visible && category.name.trim()).map((category) => ({
    ...category,
    dishes: content.dishes.filter((dish) => dish.categoryId === category.id && dish.visible && dish.name.trim() && dish.priceMinor !== null),
  })).filter((category) => category.dishes.length > 0);
}

/** Project-wide public projection: unassigned categories and their media stay in the draft. */
export function publicMenuContent(content: MenuContent): MenuContent {
  const referenced = new Set(content.pages.flatMap((page) => visibleMenuCategories(content, page.id).map((category) => category.id)));
  return {
    ...content,
    venue: { ...content.venue, name: content.venue.name.trim(), description: content.venue.description.trim() },
    pages: content.pages.map((page) => ({ ...page, name: page.name.trim(), content: { categoryIds: page.content.categoryIds.filter((id) => referenced.has(id)) } })),
    categories: content.categories.filter((category) => referenced.has(category.id)).map((category) => ({ ...category, name: category.name.trim() })),
    dishes: content.dishes.filter((dish) => referenced.has(dish.categoryId) && dish.visible && dish.name.trim() && dish.priceMinor !== null)
      .map((dish) => ({ ...dish, name: dish.name.trim(), description: dish.description.trim() })),
  };
}

/** One public dish with a photo is one slot, regardless of its occurrences on pages. */
export function countMenuDishPhotos(content: MenuContent, images: { dishes?: Record<string, unknown> }): number {
  return publicMenuContent(content).dishes.filter((dish) => {
    const image = images.dishes?.[dish.id] as { asset?: { src?: unknown } } | undefined;
    return typeof image?.asset?.src === "string" && image.asset.src.trim().length > 0;
  }).length;
}
