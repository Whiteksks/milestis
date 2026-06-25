import type { Metadata } from 'next'
import Header from "@/components/layout/header";
import { HelpPage } from "@/components/layout/supportPage/help-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Help Center',
    ru: 'Центр поддержки',
    kz: 'Анықтама орталығы',
  }
  const descriptions: Record<string, string> = {
    en: 'Find answers, guides and tutorials to get the most out of Milestis.',
    ru: 'Найдите ответы, руководства и обучающие материалы для работы с Milestis.',
    kz: 'Milestis бойынша жауаптар мен нұсқаулықтарды табыңыз.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `https://milestis.com/${locale}/help`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': 'https://milestis.com/en/help',
        'ru': 'https://milestis.com/ru/help',
        'kk': 'https://milestis.com/kz/help',
        'x-default': 'https://milestis.com/en/help',
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

export default function DesignIndexPage() {
	return (
    <div>
      <Header />
      <main className="px-4 py-16 sm:py-24">        
        <HelpPage/>
      </main>
    </div>
    )
}
