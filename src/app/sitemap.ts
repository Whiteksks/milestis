import type { MetadataRoute } from 'next'

/**
 * Set to true when ready to go public.
 * While false – returns an empty sitemap so search engines index nothing.
 */
const SITEMAP_ENABLED = true

const BASE_URL = process.env.NEXT_APP_URL ?? 'https://milestis.com'
const LOCALES = ['en', 'ru', 'kz'] as const

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface Page {
  path: string
  changeFrequency: ChangeFrequency
  priority: number
  /** Omit when actual change date is unknown — lying hurts SEO */
  lastModified?: Date
}

const PUBLIC_PAGES: Page[] = [
  // ── Core ──────────────────────────────────────────────────────────────────
  { path: '',          changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/about',    changeFrequency: 'monthly', priority: 0.8 },
  { path: '/features', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/pricing',  changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/story',    changeFrequency: 'monthly', priority: 0.6 },
  // ── Updates ───────────────────────────────────────────────────────────────
  { path: '/releases', changeFrequency: 'weekly',  priority: 0.7 },
  // ── Help ──────────────────────────────────────────────────────────────────
  { path: '/help',     changeFrequency: 'weekly',  priority: 0.7 },
  { path: '/help/faq', changeFrequency: 'monthly', priority: 0.5 },
  // ── Legal (low value, rarely change) ──────────────────────────────────────
  { path: '/policies/privacy-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/policies/terms',          changeFrequency: 'yearly', priority: 0.2 },
  { path: '/policies/cookie-policy',  changeFrequency: 'yearly', priority: 0.2 },
  // ── Sitemap (human-readable index) ────────────────────────────────────────
  { path: '/sitemap', changeFrequency: 'monthly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITEMAP_ENABLED) return []

  const entries: MetadataRoute.Sitemap = []

  for (const page of PUBLIC_PAGES) {
    const alternates: Record<string, string> = {}
    for (const locale of LOCALES) {
      alternates[locale] = `${BASE_URL}/${locale}${page.path}`
    }
    alternates['x-default'] = `${BASE_URL}/en${page.path}`

    entries.push({
      url: `${BASE_URL}/en${page.path}`,
      ...(page.lastModified ? { lastModified: page.lastModified } : {}),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: alternates },
    })
  }

  return entries
}
