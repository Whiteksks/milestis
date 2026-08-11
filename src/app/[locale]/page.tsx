import type { Metadata } from 'next'
import { AuthenticatedRedirect } from "@/components/auth/authenticated-redirect";
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
  const url = `https://milestis.com/${locale}`

  return {
    title,
    description,
    keywords: locale === 'ru'
      ? ['фотокнига', 'интерактивная фотокнига', 'создать фотокнигу', 'онлайн фотокнига', 'milestis']
      : locale === 'kz'
      ? ['фотокітап', 'интерактивті фотокітап', 'milestis']
      : ['photo book', 'interactive photo book', 'create photo book', 'online photo book', 'milestis'],
    alternates: {
      canonical: url,
      languages: {
        'en': 'https://milestis.com/en',
        'ru': 'https://milestis.com/ru',
        'kk': 'https://milestis.com/kz',
        'x-default': 'https://milestis.com/en',
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

export default function Home() {
  return (
    <>
      <AuthenticatedRedirect />
      <LandingContent />
    </>
  );
}
