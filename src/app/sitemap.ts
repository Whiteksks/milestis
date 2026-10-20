import { siteConfig } from '@/config/site'
import type { MetadataRoute } from 'next'

/**
 * Set to true when ready to go public.
 * While false – returns an empty sitemap so search engines index nothing.
 */
const SITEMAP_ENABLED = true

const BASE_URL = siteConfig.appUrl
const LOCALES = ['en', 'ru', 'kz'] as const

/** URL locale slug → correct BCP-47 hreflang value (Kazakh's ISO 639-1 code is "kk", not "kz"). */
const HREFLANG: Record<(typeof LOCALES)[number], string> = { en: 'en', ru: 'ru', kz: 'kk' }

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface Page {
  path: string
  changeFrequency: ChangeFrequency
  priority: number
  /** Omit when actual change date is unknown — lying hurts SEO */
  lastModified?: Date
}

const PUBLIC_PAGES: Page[] = [
  { path: '/restaurants', changeFrequency: 'monthly', priority: 0.8 },
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
  { path: '/help/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/help/articles/what-is-milestis',    changeFrequency: 'monthly', priority: 0.7 },
  { path: '/help/articles/getting-started',     changeFrequency: 'monthly', priority: 0.6 },
  { path: '/help/articles/publish-share',       changeFrequency: 'monthly', priority: 0.5 },
  { path: '/help/articles/how-credits-work',    changeFrequency: 'monthly', priority: 0.5 },
  { path: '/help/articles/archive-republish',   changeFrequency: 'monthly', priority: 0.5 },
  { path: '/help/articles/account-security',    changeFrequency: 'monthly', priority: 0.5 },
  // ── Sitemap (human-readable index) ────────────────────────────────────────
  { path: '/sitemap', changeFrequency: 'monthly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITEMAP_ENABLED) return []

  const entries: MetadataRoute.Sitemap = []

  for (const page of PUBLIC_PAGES) {
    const alternates: Record<string, string> = { 'x-default': `${BASE_URL}/en${page.path}` }
    for (const locale of LOCALES) {
      alternates[HREFLANG[locale]] = `${BASE_URL}/${locale}${page.path}`
    }

    // One <url> entry per locale, each carrying the full reciprocal hreflang
    // set, so ru/kz pages are discovered directly instead of only via
    // in-page language switcher links.
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        ...(page.lastModified ? { lastModified: page.lastModified } : {}),
        changeFrequency: page.changeFrequency,
        priority: locale === 'en' ? page.priority : page.priority * 0.9,
        alternates: { languages: alternates },
      })
    }
  }

  return entries
}

