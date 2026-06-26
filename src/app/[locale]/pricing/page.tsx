import type { Metadata } from 'next'
import { PricingContent } from './PricingContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Pricing',
    ru: 'Цены',
    kz: 'Бағалар',
  }
  const descriptions: Record<string, string> = {
    en: 'Simple, transparent pricing for Milestis. Start free and upgrade when you\'re ready.',
    ru: 'Простые и прозрачные тарифы Milestis. Начните бесплатно и перейдите на более высокий тариф в любое время.',
    kz: 'Milestis тарифтері — қарапайым және ашық. Тегін бастаңыз.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `https://milestis.com/${locale}/pricing`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': 'https://milestis.com/en/pricing',
        'ru': 'https://milestis.com/ru/pricing',
        'kk': 'https://milestis.com/kz/pricing',
        'x-default': 'https://milestis.com/en/pricing',
      },
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
  }
}

const PricingPage = () => {
  return <PricingContent />;
};

export default PricingPage;