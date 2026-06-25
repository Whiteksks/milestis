import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Sign In',
    ru: 'Войти',
    kz: 'Кіру',
  }
  const descriptions: Record<string, string> = {
    en: 'Sign in to your Milestis account.',
    ru: 'Войдите в свой аккаунт Milestis.',
    kz: 'Milestis аккаунтыңызға кіріңіз.',
  }

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    robots: { index: false, follow: false },
  }
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
