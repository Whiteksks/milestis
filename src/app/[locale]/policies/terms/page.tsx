import type { Metadata } from 'next'
import {IubendaTerms} from "../IubendaPolicy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Terms of Service',
    ru: 'Условия использования',
    kz: 'Пайдалану шарттары',
  }
  const descriptions: Record<string, string> = {
    en: 'Read the Milestis Terms of Service.',
    ru: 'Ознакомьтесь с Условиями использования Milestis.',
    kz: 'Milestis Пайдалану шарттарын оқыңыз.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `https://milestis.com/${locale}/policies/terms`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': 'https://milestis.com/en/policies/terms',
        'ru': 'https://milestis.com/ru/policies/terms',
        'kk': 'https://milestis.com/kz/policies/terms',
        'x-default': 'https://milestis.com/en/policies/terms',
      },
    },
    openGraph: { type: 'website', url, title, description, siteName: 'Milestis' },
  }
}

export default function TermsPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <IubendaTerms />
    </main>
  )
}
