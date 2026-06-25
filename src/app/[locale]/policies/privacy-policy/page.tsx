import type { Metadata } from 'next'
import {IubendaPrivacy} from "../IubendaPolicy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Privacy Policy',
    ru: 'Политика конфиденциальности',
    kz: 'Құпиялылық саясаты',
  }
  const descriptions: Record<string, string> = {
    en: 'Read the Milestis Privacy Policy to understand how we handle your data.',
    ru: 'Прочитайте Политику конфиденциальности Milestis.',
    kz: 'Milestis Құпиялылық саясатын оқыңыз.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `https://milestis.com/${locale}/policies/privacy-policy`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': 'https://milestis.com/en/policies/privacy-policy',
        'ru': 'https://milestis.com/ru/policies/privacy-policy',
        'kk': 'https://milestis.com/kz/policies/privacy-policy',
        'x-default': 'https://milestis.com/en/policies/privacy-policy',
      },
    },
    openGraph: { type: 'website', url, title, description, siteName: 'Milestis' },
  }
}

export default function PrivacyPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <IubendaPrivacy />
    </main>
  )
}
