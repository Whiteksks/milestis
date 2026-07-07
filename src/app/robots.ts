import type { MetadataRoute } from 'next'

/**
 * Mirror the flag in sitemap.ts.
 * false → block all crawlers (test / staging)
 * true  → allow crawlers on public pages
 */
const INDEXING_ENABLED = true

const BASE_URL = process.env.NEXT_APP_URL ?? 'https://milestis.com'

export default function robots(): MetadataRoute.Robots {
  if (!INDEXING_ENABLED) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/',
          '/account/',
          '/dashboard/',
          '/design/',
          '/api/',
          '/*/auth/',
          '/*/account/',
          '/*/dashboard/',
          '/*/design/',
          '/*/api/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
