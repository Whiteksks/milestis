import { PUBLIC_SITE_DOMAIN } from "./constants"
import type { SlugMode } from "./policy"
import { getSlugModePolicy } from "./policy"

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
  const baseUrl =
    policy.routeKind === "subdomain"
      ? `https://${slug}.${PUBLIC_SITE_DOMAIN}`
      : `https://${PUBLIC_SITE_DOMAIN}/${slug}`

  return policy.routeKind === "path" && accessToken
    ? `${baseUrl}?token=${accessToken}`
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
    ? { prefix: "https://", suffix: `.${PUBLIC_SITE_DOMAIN}` }
    : { prefix: `https://${PUBLIC_SITE_DOMAIN}/`, suffix: "" }
}