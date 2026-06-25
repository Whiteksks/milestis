import type { Metadata } from 'next'
import {IubendaCookie} from '../IubendaPolicy';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Cookie Policy',
    ru: 'Политика Cookie',
    kz: 'Cookie саясаты',
  }
  const descriptions: Record<string, string> = {
    en: 'Learn about how Milestis uses cookies.',
    ru: 'Узнайте, как Milestis использует файлы cookie.',
    kz: 'Milestis cookie файлдарын қалай пайдаланатынын біліңіз.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `https://milestis.com/${locale}/policies/cookie-policy`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': 'https://milestis.com/en/policies/cookie-policy',
        'ru': 'https://milestis.com/ru/policies/cookie-policy',
        'kk': 'https://milestis.com/kz/policies/cookie-policy',
        'x-default': 'https://milestis.com/en/policies/cookie-policy',
      },
    },
    openGraph: { type: 'website', url, title, description, siteName: 'Milestis' },
  }
}

export default function CookiePolicyPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <IubendaCookie />
    </main>
  );
}