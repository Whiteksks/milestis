import { siteConfig, publishedProjectUrl } from '../../config/site'
import type { SlugMode } from "./policy"
import { getSlugModePolicy } from "./policy"
import { isPagePath } from "../../../functions/src/domain/pages"

export function buildPublishedMenuPageUrl(slug: string, path: string): string {
  if (!isPagePath(path)) throw new Error("Invalid menu page path")
  return `${buildPublishedProjectUrl('menu', slug)}${path === '/' ? '' : path}`
}

export interface PublishedProjectShareInput {
  mode: SlugMode
  isPublished: boolean
  publishedSlug?: string | null
  publishedAccessToken?: string | null
}

export function buildPublishedProjectUrl(
  mode: SlugMode,
  slug: string,
  accessToken?: string | null,
): string {
  const policy = getSlugModePolicy(mode)
  const baseUrl = publishedProjectUrl(slug, policy.routeKind === "subdomain")

  return policy.namespace === "token" && accessToken
    ? `${baseUrl}?share=${accessToken}`
    : baseUrl
}

export function getPublishedProjectShareUrl(project: PublishedProjectShareInput): string | null {
  if (!project.isPublished || !project.publishedSlug) return null

  return buildPublishedProjectUrl(
    project.mode,
    project.publishedSlug,
    project.publishedAccessToken,
  )
}

export function getSlugInputChrome(mode: SlugMode): { prefix: string; suffix: string } {
  const policy = getSlugModePolicy(mode)

  return policy.routeKind === "subdomain"
    ? { prefix: `${new URL(siteConfig.publishedSiteUrl).protocol}//`, suffix: `.${siteConfig.publishedSiteHost}` }
    : { prefix: `${siteConfig.publishedSiteUrl}/`, suffix: "" }
}
