import React from 'react';
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server';
import { CTAButton } from '@/components/shared/cta-button';
import { ShieldCheck, Palette, Zap, Briefcase, Check } from 'lucide-react';
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Features',
    ru: 'Возможности',
    kz: 'Мүмкіндіктер',
  }
  const descriptions: Record<string, string> = {
    en: 'Discover all Milestis features — interactive layouts, stunning templates, and more for your photo book.',
    ru: 'Все возможности Milestis — интерактивные макеты, стильные шаблоны и инструменты для создания фотокниги.',
    kz: 'Milestis мүмкіндіктерін танысыңыз — интерактивті макеттер, әдемі үлгілер және фотокітап құралдары.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en

  return buildPageMetadata({ locale, path: '/features', title, description })
}

const swatches = [
  'bg-primary/70', 'bg-foreground/15', 'bg-foreground/30', 'bg-primary/30',
  'bg-foreground/30', 'bg-primary/30', 'bg-primary/70', 'bg-foreground/15',
];

const pillarIcons = [ShieldCheck, Palette, Zap];

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'features' });
  const stats = t.raw('stats') as { number: string; label: string }[];
  const pillars = (t.raw('designSystem.pillars') as { number: string; title: string; description: string }[])
    .map((pillar, i) => ({ ...pillar, icon: pillarIcons[i] }));
  const professionalFeatures = t.raw('professionals.items') as { title: string; emphasis?: boolean }[];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Subtle paper grain — keeps flat surfaces from reading as vector fills */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <Header />

      {/* Hero — asymmetric split; a layered card stack stands in for a photo */}
      <header className="px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2 md:gap-12">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                {t('hero.eyebrow')}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-balance md:text-6xl">
              {t('hero.titleLine1')}
              <br />
              <span className="text-primary italic">{t('hero.titleItalic')}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {t('hero.description')}
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-mono text-2xl font-medium tabular-nums text-foreground md:text-3xl">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fanned card stack — overlap creates depth without a photograph */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-0 rounded-2xl border border-border/50 bg-muted/40 rotate-[-6deg]" />
            <div className="absolute inset-0 rounded-2xl border border-border/60 bg-card shadow-md rotate-[4deg]" />
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60">
                  {t('hero.templateLabel')}
                </span>
                <span className="font-mono text-xs text-muted-foreground/50">04</span>
              </div>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {swatches.map((swatch, i) => (
                  <div key={i} className={`aspect-square rounded-xs ${swatch}`} />
                ))}
              </div>
              <div className="mt-6 h-2 w-2/3 rounded-full bg-muted" />
              <div className="mt-2 h-2 w-1/2 rounded-full bg-muted" />
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-foreground p-5 text-background shadow-xl md:-left-8">
              <p className="font-mono text-xs uppercase tracking-widest text-background/60">{t('hero.templatesLabel')}</p>
              <p className="mt-1 font-serif text-2xl italic">50+</p>
            </div>
          </div>
        </div>
      </header>

      {/* High-contrast manifesto break */}
      <section className="bg-foreground px-6 py-24 text-background">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-background/50">
            {t('manifesto.eyebrow')}
          </span>
          <p className="mt-6 font-serif text-3xl leading-snug italic md:text-4xl">
            &ldquo;{t('manifesto.quote')}&rdquo;
          </p>
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-background/50">
            — {t('manifesto.author')}
          </p>
        </div>
      </section>

      {/* Value pillars — no cards; oversized faint numerals + Swiss divider rules carry the depth */}
      <section className="border-b border-border/40 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-4">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              {t('designSystem.eyebrow')}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            {t('designSystem.title')}
          </h2>
          <p className="mt-2 font-serif text-lg italic text-muted-foreground">
            {t('designSystem.subtitle')}
          </p>

          <div className="mt-16 grid grid-cols-1 divide-y divide-border/60 md:grid-cols-3 md:divide-x md:divide-y-0">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="relative overflow-hidden py-10 first:pt-0 md:px-10 md:py-0 md:first:pl-0 md:last:pr-0"
              >
                <span className="pointer-events-none absolute -top-6 right-0 font-serif text-8xl italic text-foreground/5 select-none">
                  {pillar.number}
                </span>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xs border border-border text-foreground/70">
                  <pillar.icon className="h-4 w-4" />
                </div>
                <h3 className="relative mt-6 text-lg font-medium text-foreground">{pillar.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Professionals — one lifted, emphasized card among quiet ones */}
      <section className="bg-muted/20 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 flex items-center gap-4">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              {t('professionals.eyebrow')}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-5 lg:col-span-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xs border border-border text-foreground/70">
                <Briefcase className="h-4 w-4" />
              </div>
              <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
                {t('professionals.title')}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {t('professionals.description')}
              </p>
            </div>

            <div className="w-full lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {professionalFeatures.map((item) => (
                  <div
                    key={item.title}
                    className={`flex flex-col justify-between rounded-2xl p-6 transition-colors duration-300 ${
                      item.emphasis
                        ? 'relative z-10 -mt-4 bg-card border border-primary/30 shadow-xl sm:col-span-2'
                        : 'bg-card border border-border/40 shadow-sm hover:border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground/40" />
                      <p className="text-sm leading-relaxed font-medium text-foreground/90 sm:text-base">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — dark contrast panel, lifted to overlap the seam above */}
      <section className="px-6 py-24">
        <div className="relative z-10 mx-auto -mt-16 max-w-md rounded-2xl bg-foreground p-12 text-center text-background shadow-2xl md:-mt-20">
          <h2 className="font-serif text-3xl italic tracking-tight">
            {t('cta.title')}
          </h2>
          <p className="mt-4 leading-relaxed text-background/70">
            {t('cta.description')}
          </p>
          <div className="mt-8">
            <CTAButton className="rounded-xs bg-background px-10 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background/90">
              {t('cta.button')}
            </CTAButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}