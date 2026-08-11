import type { Metadata } from 'next'
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { CTAButton } from '@/components/shared/cta-button';
import { Share2, Wand2, Infinity as InfinityIcon } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';
import heroPhoto from '@/components/assets/nik-unsplash.webp';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Our Story',
  }
  const descriptions: Record<string, string> = {
    en: 'Milestis exists because memories are fragile, and platforms shouldn\u2019t be.',
  }

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
  }
}

const permanenceIcons = [Share2, Wand2, InfinityIcon];

const MissionPage = async () => {
  const t = await getTranslations('story');
  const stats = t.raw('stats') as { number: string; label: string }[];
  const permanenceFeatures = (t.raw('permanence.items') as { number: string; title: string; description: string }[])
    .map((feature, i) => ({ ...feature, icon: permanenceIcons[i] }));

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

      {/* Hero — asymmetric split, photo carries the depth */}
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

          {/* Photo panel with an overlapping floating card — literal layered depth */}
          <div className="relative">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={heroPhoto}
                alt={'Story hero photo'}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-foreground p-5 text-background shadow-xl md:-left-8">
              <p className="font-mono text-xs uppercase tracking-widest text-background/60">{t('hero.sinceLabel')}</p>
              <p className="mt-1 font-serif text-2xl italic">2026</p>
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
        </div>
      </section>

      {/* Value pillars — no photo here; oversized faint numerals + Swiss divider rules carry the depth instead */}
      <section className="border-b border-border/40 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-4">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              {t('permanence.eyebrow')}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h2 className="max-w-2xl font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            {t('permanence.title')}
          </h2>

          <div className="mt-16 grid grid-cols-1 divide-y divide-border/60 md:grid-cols-3 md:divide-x md:divide-y-0">
            {permanenceFeatures.map((feature) => (
              <div
                key={feature.number}
                className="relative overflow-hidden py-10 first:pt-0 md:px-10 md:py-0 md:first:pl-0 md:last:pr-0"
              >
                <span className="pointer-events-none absolute -top-6 right-0 font-serif text-8xl italic text-foreground/5 select-none">
                  {feature.number}
                </span>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xs border border-border text-foreground/70">
                  <feature.icon className="h-4 w-4" />
                </div>
                <h3 className="relative mt-6 text-lg font-medium text-foreground">{feature.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark contrast panel, lifted to overlap the seam above */}
      <section className="px-6 py-24">
        <div className="relative z-10 mx-auto -mt-16 max-w-3xl rounded-2xl bg-foreground p-12 text-center text-background shadow-2xl md:-mt-20">
          <h2 className="font-serif text-3xl italic tracking-tight md:text-5xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-background/70 md:text-lg">
            {t('cta.description')}
          </p>
          <div className="mt-10">
            <CTAButton className="rounded-xs bg-background px-10 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background/90">
              {t('cta.button')}
            </CTAButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MissionPage;