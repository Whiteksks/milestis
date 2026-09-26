import { isPagePath, PAGE_LIMITS } from "../pages";
import { readId } from "../validation";
import type { MenuContent, MenuPage } from "./content";

export type MenuPageErrorCode = "PAGE_LIMIT" | "PAGE_NOT_FOUND" | "INVALID_NAME" | "INVALID_PATH" | "PATH_TAKEN" | "HOME_REQUIRED";
export class MenuPageError extends Error {
  constructor(public readonly code: MenuPageErrorCode) { super(code); }
}

function requirePage(content: MenuContent, id: string): MenuPage {
  const page = content.pages.find((entry) => entry.id === id);
  if (!page) throw new MenuPageError("PAGE_NOT_FOUND");
  return page;
}

function pageName(name: string): string {
  const value = name.trim();
  if (!value || value.length > PAGE_LIMITS.name) throw new MenuPageError("INVALID_NAME");
  return value;
}

function checkPath(content: MenuContent, id: string, path: string) {
  if (!isPagePath(path) || ((id === content.homePageId) !== (path === "/"))) throw new MenuPageError("INVALID_PATH");
  if (content.pages.some((page) => page.id !== id && page.path === path)) throw new MenuPageError("PATH_TAKEN");
}

export function nextMenuPagePath(content: MenuContent): string {
  const paths = new Set(content.pages.map((page) => page.path));
  let number = 2;
  while (paths.has(`/page-${number}`)) number++;
  return `/page-${number}`;
}

const cyrillic: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  ә: "a", ғ: "gh", қ: "q", ң: "ng", ө: "o", ұ: "u", ү: "u", һ: "h", і: "i",
};

/** Suggest a readable path while preserving the path if the owner edits it manually. */
export function suggestMenuPagePath(content: MenuContent, name: string): string {
  const base = Array.from(name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, ""))
    .map((char) => cyrillic[char] ?? char).join("")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, PAGE_LIMITS.path - 4).replace(/-$/g, "");
  if (!base) return nextMenuPagePath(content);
  const paths = new Set(content.pages.map((page) => page.path));
  let number = 1;
  while (true) {
    const suffix = number === 1 ? "" : `-${number}`;
    const path = `/${base.slice(0, PAGE_LIMITS.path - 1 - suffix.length).replace(/-$/g, "")}${suffix}`;
    if (isPagePath(path) && !paths.has(path)) return path;
    number++;
  }
}

export function addMenuPage(content: MenuContent, input: Pick<MenuPage, "id" | "name" | "path">): MenuContent {
  if (content.pages.length >= PAGE_LIMITS.pages) throw new MenuPageError("PAGE_LIMIT");
  readId(input.id, "page.id");
  if (content.pages.some((page) => page.id === input.id)) throw new MenuPageError("INVALID_PATH");
  checkPath(content, input.id, input.path);
  return { ...content, pages: [...content.pages, { ...input, name: pageName(input.name), content: { categoryIds: [] } }] };
}

/** Making a new home swaps paths atomically; the former home keeps a reachable address. */
export function updateMenuPage(content: MenuContent, id: string, input: { name: string; path: string; makeHome?: boolean }): MenuContent {
  requirePage(content, id);
  checkPath(content, id, input.path);
  const name = pageName(input.name);
  const makeHome = input.makeHome && id !== content.homePageId;
  return {
    ...content,
    homePageId: makeHome ? id : content.homePageId,
    pages: content.pages.map((page) => {
      if (page.id === id) return { ...page, name, path: makeHome ? "/" : input.path };
      if (makeHome && page.id === content.homePageId) return { ...page, path: input.path };
      return page;
    }),
  };
}

/** Delete only the composition; categories, dishes and images belong to the project. */
export function removeMenuPage(content: MenuContent, id: string): MenuContent {
  requirePage(content, id);
  if (content.homePageId === id) throw new MenuPageError("HOME_REQUIRED");
  return { ...content, pages: content.pages.filter((page) => page.id !== id) };
}

export function setMenuPageCategory(content: MenuContent, pageId: string, categoryId: string, attached: boolean): MenuContent {
  const page = requirePage(content, pageId);
  if (!content.categories.some((category) => category.id === categoryId)) return content;
  const ids = page.content.categoryIds;
  if (ids.includes(categoryId) === attached) return content;
  return { ...content, pages: content.pages.map((entry) => entry.id === pageId
    ? { ...entry, content: { categoryIds: attached ? [...ids, categoryId] : ids.filter((id) => id !== categoryId) } }
    : entry) };
}
