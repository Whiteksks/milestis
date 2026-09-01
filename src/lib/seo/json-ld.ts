/**
 * Structured data (schema.org) builders. Keep payloads minimal and factual —
 * inflated/incorrect structured data can trigger manual actions from Google.
 */

const BASE_URL = process.env.NEXT_APP_URL ?? 'https://milestis.com';

/** Social profile URLs for the `sameAs` entity graph. Populate as profiles go live. */
const SAME_AS: string[] = [
  'https://www.tiktok.com/@milestis.studio',
  'https://www.instagram.com/milestis.studio/',
];

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Milestis',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.ico`,
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'Milestis',
    url: BASE_URL,
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: ['en', 'ru', 'kk'],
  };
}

export function softwareApplicationJsonLd(locale: string) {
  const descriptions: Record<string, string> = {
    en: 'Create beautiful interactive photo books and share your story with the world.',
    ru: 'Создавайте красивые интерактивные фотокниги и делитесь своей историей.',
    kz: 'Әдемі интерактивті фотокітаптар жасаңыз және тарихыңызбен бөлісіңіз.',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Milestis',
    url: `${BASE_URL}/${locale}`,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    description: descriptions[locale] ?? descriptions.en,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: { '@id': `${BASE_URL}/#organization` },
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export interface BreadcrumbEntry {
  name: string;
  url: string;
}

export function breadcrumbJsonLd(items: BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

const HOME_LABEL: Record<string, string> = { en: 'Home', ru: 'Главная', kz: 'Басты бет' };
const HELP_LABEL: Record<string, string> = { en: 'Help Center', ru: 'Центр поддержки', kz: 'Анықтама орталығы' };

/** Home → Help Center → article breadcrumb trail for a help-center article page. */
export function helpArticleBreadcrumbJsonLd(locale: string, articleTitle: string, articlePath: string) {
  return breadcrumbJsonLd([
    { name: HOME_LABEL[locale] ?? HOME_LABEL.en, url: `${BASE_URL}/${locale}` },
    { name: HELP_LABEL[locale] ?? HELP_LABEL.en, url: `${BASE_URL}/${locale}/help` },
    { name: articleTitle, url: `${BASE_URL}/${locale}${articlePath}` },
  ]);
}

export interface HowToStepInput {
  name: string;
  anchor: string;
}

/** HowTo schema for step-by-step help articles; step text reuses each section's own TOC label (already-translated, non-fabricated content). */
export function howToJsonLd({
  locale,
  path,
  name,
  description,
  steps,
}: {
  locale: string;
  path: string;
  name: string;
  description: string;
  steps: HowToStepInput[];
}) {
  const url = `${BASE_URL}/${locale}${path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.name,
      url: `${url}#${step.anchor}`,
    })),
  };
}
