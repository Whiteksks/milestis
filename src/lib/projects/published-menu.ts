import type { Metadata } from 'next'
import { readMenuContent } from '../../../functions/src/domain/menu/content'
import { findPageByPath, isPagePath, pageLinks } from '../../../functions/src/domain/pages'
import { ContentValidationError } from '../../../functions/src/domain/validation'
import type { getPublishedGlobalProject } from './published-global'
import { buildPublishedMenuPageUrl } from '../slug/url'

type PublishedProject = NonNullable<Awaited<ReturnType<typeof getPublishedGlobalProject>>>

/** Resolve only the published composition; never fall back to a draft or the home page. */
export function resolvePublishedMenuPage(project: PublishedProject | null, path: string) {
  if (project?.mode !== 'menu' || !isPagePath(path)) return null
  try {
    const menu = readMenuContent(project.content?.sectionContent)
    const page = findPageByPath(menu, path)
    return page ? { project, menu, page } : null
  } catch (error) {
    if (error instanceof ContentValidationError) return null
    throw error
  }
}

export type PublishedMenuPage = NonNullable<ReturnType<typeof resolvePublishedMenuPage>>

/** Owner-facing share data must come from a live snapshot, including on modal reopen. */
export function readPublishedMenuLinks(value: unknown) {
  const data = value as { mode?: unknown; isPublished?: unknown; content?: { sectionContent?: unknown } } | undefined
  if (data?.mode !== 'menu' || data.isPublished !== true) return []
  return pageLinks(readMenuContent(data.content?.sectionContent))
}

export function publishedMenuMetadata({ project, menu, page }: PublishedMenuPage): Metadata {
  const venueTitle = menu.venue.name || project.name
  const title = page.path !== '/' && page.name ? `${page.name} — ${venueTitle}` : venueTitle
  const description = menu.venue.description.slice(0, 160)
  const url = buildPublishedMenuPageUrl(project.slug, page.path)
  const images = [{ url: `${buildPublishedMenuPageUrl(project.slug, '/')}/opengraph-image`, width: 1200, height: 630, alt: venueTitle }]
  return {
    title: { absolute: title }, description, alternates: { canonical: url },
    openGraph: { title, description, type: 'website', url, images },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}
