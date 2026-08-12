import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { CTAButton } from '@/components/shared/cta-button';
import {
  LayoutTemplate, ImagePlus, Sparkles, Share2,
  ShieldCheck, Layers, Palette, Link2,
} from 'lucide-react';
import { EventStoriesIcon } from '@/components/assets/use-case1';
import { InstantPortfoliosIcon } from '@/components/assets/use-case2';
import { PhotographerUpsellIcon } from '@/components/assets/use-case3';
import heroPhoto from '@/components/assets/n1ce-unsplash.webp';

const stepIcons = [LayoutTemplate, ImagePlus, Sparkles, Share2];
const featureIcons = [ShieldCheck, Layers, Palette, Sparkles, Link2];
const useCaseIcons = { events: EventStoriesIcon, portfolios: InstantPortfoliosIcon, upsell: PhotographerUpsellIcon };

// Shared body used by both the root landing page and /about (which mirrors it, minus the auth redirect).
export async function LandingContent() {
  const t = await getTranslations('landing');
  const stats = t.raw('stats') as { number: string; label: string }[];
  const steps = (t.raw('howItWorks.steps') as { number: string; title: string; description: string }[])
    .map((step, i) => ({ ...step, icon: stepIcons[i] }));
  const features = (t.raw('features.items') as { title: string; description: string }[])
    .map((feature, i) => ({ ...feature, icon: featureIcons[i], emphasis: i === 0 }));
  const useCases = (t.raw('useCases.items') as { id: keyof typeof useCaseIcons; title: string; description: string }[])
    .map((useCase) => ({ ...useCase, Icon: useCaseIcons[useCase.id] }));

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
                alt={t('hero.imageAlt')}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-foreground p-5 text-background shadow-xl md:-left-8">
              <p className="font-mono text-xs uppercase tracking-widest text-background/60">{t('hero.combinationsLabel')}</p>
              <p className="mt-1 font-serif text-2xl italic">{t('hero.combinationsValue')}</p>
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

      {/* How it works — oversized faint numerals + Swiss divider rules carry the depth */}
      <section className="border-b border-border/40 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center gap-4">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              {t('howItWorks.eyebrow')}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h2 className="max-w-2xl font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            {t('howItWorks.title')}
          </h2>

          <div className="mt-16 grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative overflow-hidden py-10 first:pt-0 sm:px-8 sm:py-0 sm:first:pl-0 sm:last:pr-0"
              >
                <span className="pointer-events-none absolute -top-6 right-0 font-serif text-8xl italic text-foreground/5 select-none">
                  {step.number}
                </span>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xs border border-border text-foreground/70">
                  <step.icon className="h-4 w-4" />
                </div>
                <h3 className="relative mt-6 text-lg font-medium text-foreground">{step.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — one lifted, emphasized card among quiet ones */}
      <section className="bg-muted/20 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 flex items-center gap-4">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              {t('features.eyebrow')}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`rounded-2xl p-6 transition-colors duration-300 ${
                  feature.emphasis
                    ? 'relative z-10 -mt-4 border border-primary/30 bg-card shadow-xl sm:col-span-2'
                    : 'border border-border/40 bg-card shadow-sm hover:border-border'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xs border border-border text-foreground/70">
                  <feature.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases — quiet card grid, real brand illustrations carry the visual weight */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex items-center gap-4">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              {t('useCases.eyebrow')}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map(({ id, Icon, title, description }) => (
              <div
                key={id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-colors hover:border-border"
              >
                <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-muted/30 p-8">
                  <Icon className="h-auto w-full max-w-[280px] scale-150 text-foreground/80" />
                </div>
                <div className="p-8">
                  <h3 className="text-lg font-medium text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
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
}
