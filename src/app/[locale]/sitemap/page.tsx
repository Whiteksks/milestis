import type { Metadata } from 'next'
import Header from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/routing'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Sitemap',
    ru: 'Карта сайта',
    kz: 'Сайт картасы',
  }
  const descriptions: Record<string, string> = {
    en: 'Every public page on Milestis, grouped by section.',
    ru: 'Все публичные страницы Milestis, сгруппированные по разделам.',
    kz: 'Milestis сайтының барлық ашық беттері, бөлімдер бойынша топтастырылған.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `https://milestis.com/${locale}/sitemap`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: 'https://milestis.com/en/sitemap',
        ru: 'https://milestis.com/ru/sitemap',
        kk: 'https://milestis.com/kz/sitemap',
        'x-default': 'https://milestis.com/en/sitemap',
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

interface SitemapLink {
  href: string
  label: Record<string, string>
}

interface SitemapSection {
  heading: Record<string, string>
  links: SitemapLink[]
}

const SECTIONS: SitemapSection[] = [
  {
    heading: { en: 'For restaurants', ru: 'Для ресторанов', kz: 'Мейрамханаларға' },
    links: [{ href: '/restaurants', label: { en: 'Living menus', ru: 'Живое меню', kz: 'Жанды мәзір' } }],
  },
  {
    heading: { en: 'Product', ru: 'Продукт', kz: 'Өнім' },
    links: [
      { href: '/', label: { en: 'Home', ru: 'Главная', kz: 'Басты бет' } },
      { href: '/features', label: { en: 'Features', ru: 'Возможности', kz: 'Мүмкіндіктер' } },
      { href: '/pricing', label: { en: 'Pricing', ru: 'Цены', kz: 'Бағалар' } },
      { href: '/releases', label: { en: 'Releases', ru: 'Обновления', kz: 'Жаңартулар' } },
    ],
  },
  {
    heading: { en: 'Company', ru: 'Компания', kz: 'Компания' },
    links: [
      { href: '/about', label: { en: 'About', ru: 'О нас', kz: 'Біз туралы' } },
      { href: '/story', label: { en: 'Our Story', ru: 'Наша история', kz: 'Біздің тарих' } },
    ],
  },
  {
    heading: { en: 'Help & Support', ru: 'Помощь и поддержка', kz: 'Көмек және қолдау' },
    links: [
      { href: '/help', label: { en: 'Help Center', ru: 'Центр поддержки', kz: 'Анықтама орталығы' } },
      { href: '/help/faq', label: { en: 'FAQ', ru: 'Частые вопросы', kz: 'Жиі қойылатын сұрақтар' } },
      { href: '/help/articles/getting-started', label: { en: 'Getting Started', ru: 'Начало работы', kz: 'Жұмысты бастау' } },
      { href: '/help/articles/what-is-milestis', label: { en: 'What is Milestis', ru: 'Что такое Milestis', kz: 'Milestis дегеніміз не' } },
      { href: '/help/articles/how-credits-work', label: { en: 'How Credits Work', ru: 'Как работают кредиты', kz: 'Кредиттер қалай жұмыс істейді' } },
      { href: '/help/articles/publish-share', label: { en: 'Publish & Share', ru: 'Публикация и доступ', kz: 'Жариялау және бөлісу' } },
      { href: '/help/articles/archive-republish', label: { en: 'Archive & Republish', ru: 'Архивирование и повторная публикация', kz: 'Мұрағаттау және қайта жариялау' } },
      { href: '/help/articles/account-security', label: { en: 'Account Security', ru: 'Безопасность аккаунта', kz: 'Аккаунт қауіпсіздігі' } },
    ],
  },
  {
    heading: { en: 'Legal', ru: 'Правовая информация', kz: 'Заңды ақпарат' },
    links: [
      { href: '/policies/privacy-policy', label: { en: 'Privacy Policy', ru: 'Политика конфиденциальности', kz: 'Құпиялылық саясаты' } },
      { href: '/policies/terms', label: { en: 'Terms and Conditions', ru: 'Условия использования', kz: 'Пайдалану шарттары' } },
      { href: '/policies/cookie-policy', label: { en: 'Cookie Policy', ru: 'Политика использования файлов cookie', kz: 'Cookie саясаты' } },
      { href: '/policies/acceptable-use-policy', label: { en: 'Acceptable Use Policy', ru: 'Политика допустимого использования', kz: 'Рұқсат етілген пайдалану саясаты' } },
      { href: '/policies/refund-policy', label: { en: 'Refund Policy', ru: 'Политика возврата', kz: 'Қайтару саясаты' } },
    ],
  },
]

const HEADINGS: Record<string, string> = {
  en: 'Sitemap',
  ru: 'Карта сайта',
  kz: 'Сайт картасы',
}

const INTROS: Record<string, string> = {
  en: 'Every public page on Milestis, grouped by section.',
  ru: 'Все публичные страницы Milestis, сгруппированные по разделам.',
  kz: 'Milestis сайтының барлық ашық беттері, бөлімдер бойынша топтастырылған.',
}

export default async function SitemapPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const heading = HEADINGS[locale] ?? HEADINGS.en
  const intro = INTROS[locale] ?? INTROS.en

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-5xl mx-auto pt-32 pb-24 px-6">
        <h1 className="font-serif text-5xl leading-tight tracking-tight text-balance mb-4 md:text-6xl">
          {heading}
        </h1>
        <p className="text-muted-foreground text-lg font-light max-w-2xl leading-relaxed mb-16">
          {intro}
        </p>

        <div className="grid gap-12 sm:grid-cols-2">
          {SECTIONS.map((section) => (
            <nav key={section.heading.en} aria-label={section.heading[locale] ?? section.heading.en}>
              <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {section.heading[locale] ?? section.heading.en}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-base text-foreground/80 transition-colors hover:text-primary hover:underline underline-offset-4"
                    >
                      {link.label[locale] ?? link.label.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
