import { siteConfig } from '@/config/site'
// /about always shows the landing page — visible to everyone including logged-in users.
import type { Metadata } from 'next'
import { LandingContent } from '@/components/layout/landing/landing-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Milestis — Create Your Interactive Photo Book',
    ru: 'Milestis — Создайте интерактивную фотокнигу',
    kz: 'Milestis — Интерактивті фотокітапты жасаңыз',
  }
  const descriptions: Record<string, string> = {
    en: 'Create beautiful interactive photo books and share your story with the world. Start for free — no design skills needed.',
    ru: 'Создавайте красивые интерактивные фотокниги и делитесь своей историей. Начните бесплатно.',
    kz: 'Әдемі интерактивті фотокітаптар жасаңыз және тарихыңызбен бөлісіңіз. Тегін бастаңыз.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en

  return {
    title,
    description,
    // Canonical points to the root landing — /about is a mirror
    alternates: {
      canonical: `${siteConfig.appUrl}/${locale}`,
    },
    openGraph: {
      type: 'website',
      url: `${siteConfig.appUrl}/${locale}`,
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <LandingContent locale={locale} />;
}
