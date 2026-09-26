import { publicMenuContent, readMenuContent } from "../../domain/menu/content";
import { ContentValidationError } from "../../domain/validation";

export class MenuPublishError extends Error {
  constructor(public readonly code: string, public readonly status = 400) { super(code); }
}

function record(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new MenuPublishError("INVALID_MENU");
  return value as Record<string, any>;
}
function image(value: unknown) {
  const data = record(value);
  const asset = record(data.asset);
  if (typeof asset.src !== "string" || !asset.src || !Number.isFinite(asset.width) || asset.width < 0 || !Number.isFinite(asset.height) || asset.height < 0) throw new MenuPublishError("INVALID_IMAGE");
  if (data.crop) {
    const crop = record(data.crop);
    const rect = record(crop.rect);
    if (!["left", "top", "width", "height"].every((key) => typeof rect[key] === "number" && Number.isFinite(rect[key]) && rect[key] >= 0 && rect[key] <= 1) || !rect.width || !rect.height || typeof crop.ratio !== "string") throw new MenuPublishError("INVALID_IMAGE");
    if (rect.left + rect.width > 1 + 1e-9 || rect.top + rect.height > 1 + 1e-9) throw new MenuPublishError("INVALID_IMAGE");
  }
  if (data.presentation && (typeof data.presentation !== "object" || (data.presentation.fit && !["cover", "contain"].includes(data.presentation.fit)))) throw new MenuPublishError("INVALID_IMAGE");
  return data;
}

/** Only visible, complete dishes enter the public document. Hidden drafts stay private. */
export function prepareMenuSnapshot(draft: unknown) {
  const data = record(draft);
  if (Buffer.byteLength(JSON.stringify(data)) > 700_000) throw new MenuPublishError("INVALID_MENU");
  const content = record(data.content);
  let menu;
  try {
    menu = readMenuContent(content.sectionContent);
  } catch (error) {
    if (error instanceof ContentValidationError) throw new MenuPublishError("INVALID_MENU");
    throw error;
  }
  if (!menu.venue.name.trim()) throw new MenuPublishError("VENUE_REQUIRED");
  const published = publicMenuContent(menu);
  const visibility = record(content.sectionVisibility);
  if (!published.dishes.length || visibility.showMenu === false) throw new MenuPublishError("EMPTY_MENU");
  const images = record(content.imageContent ?? {});
  const dishImages = record(images.dishes ?? {});
  const backgrounds = record(images.pageBackgrounds ?? {});
  const publicImages: Record<string, unknown> = {};
  for (const dish of published.dishes) if (dishImages[dish.id]) publicImages[dish.id] = image(dishImages[dish.id]);
  const publicBackgrounds: Record<string, unknown> = {};
  for (const page of published.pages) if (backgrounds[page.id]) publicBackgrounds[page.id] = image(backgrounds[page.id]);
  const theme = record(data.theme);
  return {
    theme: { ...theme, currentTemplateId: "menu-classic", customDecorations: [] },
    content: {
      sectionContent: published,
      sectionVisibility: { showVenue: visibility.showVenue !== false, showMenu: true },
      imageContent: { ...(visibility.showVenue !== false && images.logo ? { logo: image(images.logo) } : {}), dishes: publicImages, pageBackgrounds: publicBackgrounds },
    },
  };
}
