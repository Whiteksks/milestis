import type { MetadataRoute } from 'next'

/**
 * Set to true when ready to go public.
 * While false – returns an empty sitemap so search engines index nothing.
 */
const SITEMAP_ENABLED = false

const BASE_URL = process.env.NEXT_APP_URL ?? 'https://milestis.com'
const LOCALES = ['en', 'ru', 'kz'] as const

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface Page {
  path: string
  changeFrequency: ChangeFrequency
  priority: number
}

const PUBLIC_PAGES: Page[] = [
  { path: '',           changeFrequency: 'weekly',  priority: 1.0  },
  { path: '/about',     changeFrequency: 'monthly', priority: 0.9  },
  { path: '/features',  changeFrequency: 'monthly', priority: 0.8  },
  { path: '/pricing',   changeFrequency: 'weekly',  priority: 0.8  },
  { path: '/story',     changeFrequency: 'monthly', priority: 0.7  },
  { path: '/releases',  changeFrequency: 'weekly',  priority: 0.6  },
  { path: '/help',      changeFrequency: 'weekly',  priority: 0.6  },
  { path: '/help/faq',  changeFrequency: 'monthly', priority: 0.5  },
  { path: '/policies/privacy-policy',  changeFrequency: 'yearly', priority: 0.3 },
  { path: '/policies/terms',           changeFrequency: 'yearly', priority: 0.3 },
  { path: '/policies/cookie-policy',   changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITEMAP_ENABLED) return []

  const entries: MetadataRoute.Sitemap = []

  for (const page of PUBLIC_PAGES) {
    const alternates: Record<string, string> = {}
    for (const locale of LOCALES) {
      alternates[locale] = `${BASE_URL}/${locale}${page.path}`
    }

    entries.push({
      url: `${BASE_URL}/en${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: alternates },
    })
  }

  return entries
}
