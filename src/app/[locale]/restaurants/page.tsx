import { getTranslations } from 'next-intl/server'
import { ArrowDown, ArrowUpRight, Check, ChefHat, Heart, Layers3, QrCode, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react'
import Header from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { MascotStudio } from '@/components/restaurant/mascot-studio'
import { RestaurantTemplateGallery } from '@/components/restaurant/template-gallery'
import './restaurant.css'

type Props = { params: Promise<{ locale: string }> }
export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'restaurants' })
  return buildPageMetadata({ locale, path: '/restaurants', title: t('meta.title'), description: t('meta.description') })
}

export default async function RestaurantsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'restaurants' })
  const features = [
    { id: 'qr', icon: QrCode }, { id: 'selection', icon: ShoppingBag }, { id: 'updates', icon: RefreshCw },
  ] as const
  const highlights = [
    { key: 'design', icon: Layers3 }, { key: 'character', icon: Heart },
    { key: 'qr', icon: QrCode }, { key: 'live', icon: RefreshCw },
  ] as const
  return <div className="restaurant-page min-h-screen selection:bg-[#eec1a6]">
    <Header />
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-32 md:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:pb-28 lg:pt-44">
        <div>
          <p className="restaurant-eyebrow mb-7 flex items-center gap-3"><span className="h-px w-9 bg-current" />{t('hero.eyebrow')}</p>
          <h1 className="restaurant-display max-w-2xl text-[clamp(3.5rem,7vw,6.5rem)] leading-[.98] tracking-[-.035em]">{t('hero.title')}<br /><span className="italic text-[#bb5439]">{t('hero.accent')}</span></h1>
          <p className="mt-7 max-w-md text-base leading-8 text-[#776456] sm:text-lg">{t('hero.description')}</p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link href="/dashboard" className="inline-flex min-h-14 items-center gap-6 rounded-full bg-[#35432e] px-7 text-sm font-medium text-[#fff8e9] transition-colors hover:bg-[#475b3c]">{t('hero.cta')}<ArrowUpRight className="size-5" /></Link>
            <a href="#styles" className="inline-flex min-h-12 items-center gap-2 text-sm font-medium underline decoration-[#b8a68d] underline-offset-8">{t('hero.explore')}<ArrowDown className="size-4" /></a>
          </div>
          <p className="mt-6 text-xs leading-5 text-[#776456]">{t('hero.audience')}</p>
        </div>
        <MascotStudio />
      </section>

      <div className="border-y border-[#d9ccba] bg-[#eee7d8] px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4 text-xs font-medium sm:text-sm">
          {highlights.map(({ key, icon: Icon }) => <span key={key} className="flex items-center gap-2.5"><Icon className="size-4 text-[#a34f37]" />{t(`strip.${key}`)}</span>)}
        </div>
      </div>

      <section id="styles" className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><p className="restaurant-eyebrow text-[#94715b]">01 / {t('styles.eyebrow')}</p><h2 className="restaurant-display mt-4 text-5xl leading-[1.05] sm:text-6xl">{t('styles.title')}</h2></div>
          <p className="max-w-sm text-sm leading-7 text-[#776456]">{t('styles.description')}</p>
        </div>
        <RestaurantTemplateGallery />
      </section>

      <section className="bg-[#35432e] px-6 py-20 text-[#faf6ed] md:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 md:items-end"><div><p className="restaurant-eyebrow text-[#c6d4b5]">02 / {t('features.eyebrow')}</p><h2 className="restaurant-display mt-4 max-w-xl text-5xl leading-[1.05] sm:text-6xl">{t('features.title')}</h2></div><p className="max-w-md text-sm leading-7 text-[#d2d8c9] md:justify-self-end">{t('features.description')}</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map(({ id, icon: Icon }, index) => <article key={id} className="flex flex-col rounded-3xl border border-[#6a795e] bg-[#3d4c35] p-7">
              <div className="flex items-center justify-between"><Icon aria-hidden="true" className="size-8 text-[#e1efad]" /><span className="font-mono text-xs text-[#bdcbaa]">0{index + 1}</span></div>
              <h3 className="restaurant-display mt-10 text-3xl">{t(`features.${id}.title`)}</h3><p className="mt-4 text-sm leading-7 text-[#d2d8c9]">{t(`features.${id}.description`)}</p>
            </article>)}
          </div>
          <p className="mt-6 flex items-start gap-2 text-xs leading-6 text-[#c6d4b5]"><Check className="mt-1 size-4 shrink-0" />{t('features.note')}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-10 lg:grid-cols-2 lg:gap-24 lg:py-28">
        <div className="relative flex flex-col justify-center rounded-[2rem] border border-[#d9ccba] bg-[#eee7d8] p-8 sm:p-12">
          <ChefHat aria-hidden="true" className="mb-9 size-12 text-[#a34f37]" />
          <p className="restaurant-display text-4xl leading-tight sm:text-5xl">{t('character.title')}</p>
          <p className="mt-6 text-sm leading-7 text-[#776456]">{t('character.description')}</p>
          <a href="#meet-mascot" className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm font-medium">{t('character.link')}<ArrowUpRight className="size-4" /></a>
          <Sparkles aria-hidden="true" className="absolute right-8 top-9 size-7 text-[#94715b]" />
        </div>
        <div>
          <p className="restaurant-eyebrow text-[#94715b]">03 / {t('steps.eyebrow')}</p>
          <h2 className="restaurant-display mt-4 text-5xl leading-tight">{t('steps.title')}</h2>
          <ol className="mt-8">
            {['create', 'fill', 'share'].map((step, index) => <li key={step} className="flex gap-5 border-t border-[#d9ccba] py-6"><span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#c7b89f] font-mono text-xs">0{index + 1}</span><div><h3 className="text-base font-medium">{t(`steps.${step}.title`)}</h3><p className="mt-2 text-sm leading-6 text-[#776456]">{t(`steps.${step}.description`)}</p></div></li>)}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20 md:px-10">
        <h2 className="restaurant-display mb-8 text-center text-4xl">{t('faq.title')}</h2>
        {['app', 'qr', 'order'].map(key => <details key={key} className="group border-b border-[#d9ccba] py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-medium [&::-webkit-details-marker]:hidden">{t(`faq.${key}.question`)}<span aria-hidden="true" className="text-xl transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 max-w-2xl text-sm leading-7 text-[#776456]">{t(`faq.${key}.answer`)}</p></details>)}
      </section>

      <section className="px-6 pb-20 md:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#e1efad] px-6 py-16 text-center sm:px-12">
          <div aria-hidden="true" className="restaurant-ticket pointer-events-none absolute inset-y-0 left-0 w-12 opacity-40" />
          <p className="restaurant-eyebrow">{t('end.eyebrow')}</p><h2 className="restaurant-display mx-auto mt-5 max-w-2xl text-5xl leading-[1.05] sm:text-7xl">{t('end.title')}</h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#53603f]">{t('end.description')}</p>
          <Link href="/dashboard" className="mt-8 inline-flex min-h-14 items-center gap-6 rounded-full bg-[#35432e] px-8 text-sm font-medium text-[#fff8e9] hover:bg-[#475b3c]">{t('hero.cta')}<ArrowUpRight className="size-5" /></Link>
        </div>
      </section>
    </main>
    <Footer showThemeSwitcher={false} />
  </div>
}
