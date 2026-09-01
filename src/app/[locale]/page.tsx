import type { Metadata } from 'next'
import { AuthenticatedRedirect } from "@/components/auth/authenticated-redirect";
import { LandingContent } from '@/components/layout/landing/landing-content';
import { JsonLd } from '@/components/shared/json-ld';
import { softwareApplicationJsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';

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
    ...buildPageMetadata({ locale, path: '', title, description }),
    keywords: locale === 'ru'
      ? ['фотокнига', 'интерактивная фотокнига', 'создать фотокнигу', 'онлайн фотокнига', 'milestis']
      : locale === 'kz'
      ? ['фотокітап', 'интерактивті фотокітап', 'milestis']
      : ['photo book', 'interactive photo book', 'create photo book', 'online photo book', 'milestis'],
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <>
      <JsonLd data={softwareApplicationJsonLd(locale)} />
      <AuthenticatedRedirect />
      <LandingContent locale={locale} />
    </>
  );
}
