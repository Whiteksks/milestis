import { siteConfig } from '@/config/site'
import type { Metadata } from 'next';

const BASE_URL = siteConfig.appUrl;

/** URL locale slug → correct BCP-47 hreflang value (Kazakh's ISO 639-1 code is "kk", not "kz"). */
const HREFLANG: Record<string, string> = { en: 'en', ru: 'ru', kz: 'kk' };

export const LOCALES = ['en', 'ru', 'kz'] as const;

/**
 * Builds canonical + hreflang alternates + OpenGraph/Twitter metadata for a
 * localized marketing page. `path` must start with "/" and exclude the locale
 * segment, e.g. "/features" or "" for the root.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;

  const languages: Record<string, string> = { 'x-default': `${BASE_URL}/en${path}` };
  for (const loc of LOCALES) {
    languages[HREFLANG[loc]] = `${BASE_URL}/${loc}${path}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Milestis',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
