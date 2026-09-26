import { ContentValidationError, readId, readList, readRecord, readText } from "./validation";

export const PAGE_LIMITS = { pages: 20, name: 100, path: 64 } as const;

/** Page content belongs to a mode; identity and routing do not. */
export interface ProjectPage<TContent> {
  id: string;
  name: string;
  path: string;
  content: TContent;
}

export interface ProjectPages<TContent> {
  homePageId: string;
  pages: ProjectPage<TContent>[];
}

export type PageLink = Pick<ProjectPage<unknown>, "id" | "name" | "path">;

export function pageLinks(project: ProjectPages<unknown>): PageLink[] {
  return project.pages.map(({ id, name, path }) => ({ id, name, path }));
}

const reservedPaths = new Set([
  "/api", "/_next", "/sites", "/opengraph-image", "/twitter-image",
  // The proxy rejects these scanner paths before it resolves a subdomain.
  "/wp-admin", "/wp-content", "/wp-includes", "/cgi-bin",
]);

/** One canonical path segment for the first version; no URL/query/hash aliases. */
export function isPagePath(value: unknown): value is string {
  return typeof value === "string" && value.length <= PAGE_LIMITS.path
    && (value === "/" || /^\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
    && !reservedPaths.has(value);
}

export function readProjectPages<T>(
  rawPages: unknown,
  rawHomePageId: unknown,
  readContent: (value: unknown, path: string) => T,
): ProjectPages<T> {
  const homePageId = readId(rawHomePageId, "homePageId");
  const ids = new Set<string>();
  const paths = new Set<string>();
  const pages = readList(rawPages, "pages", PAGE_LIMITS.pages).map((entry, index) => {
    const location = `pages.${index}`;
    const page = readRecord(entry, location);
    const id = readId(page.id, `${location}.id`);
    if (ids.has(id)) throw new ContentValidationError(`${location}.id`);
    ids.add(id);
    if (!isPagePath(page.path) || paths.has(page.path)) throw new ContentValidationError(`${location}.path`);
    paths.add(page.path);
    if ((id === homePageId) !== (page.path === "/")) throw new ContentValidationError(`${location}.path`);
    return {
      id,
      name: readText(page.name, `${location}.name`, PAGE_LIMITS.name),
      path: page.path,
      content: readContent(page.content, `${location}.content`),
    };
  });
  if (!ids.has(homePageId)) throw new ContentValidationError("homePageId");
  return { homePageId, pages };
}

export function findPageByPath<T>(project: ProjectPages<T>, path: string): ProjectPage<T> | undefined {
  return project.pages.find((page) => page.path === path);
}
