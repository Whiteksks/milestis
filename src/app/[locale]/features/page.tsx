import React from 'react';
import type { Metadata } from 'next'
import { useTranslations } from 'next-intl';
import { CTAButton } from '@/components/shared/cta-button';
import {
  Palette,
  Layers,
  Zap,
  CloudLightning,
  Maximize,
  Infinity,
  ShieldCheck,
  Briefcase,
  GripHorizontal,
  Check,
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

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
    en: 'Discover all Milestis features — interactive layouts, stunning templates, drag-and-drop media uploads, and more.',
    ru: 'Откройте все возможности Milestis — интерактивные макеты, красивые шаблоны, загрузка медиа и многое другое.',
    kz: 'Milestis мүмкіндіктерін ашыңыз — интерактивті макеттер, үлгілер, медиа жүктеу және тағы басқа.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `https://milestis.com/${locale}/features`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': 'https://milestis.com/en/features',
        'ru': 'https://milestis.com/ru/features',
        'kk': 'https://milestis.com/kz/features',
        'x-default': 'https://milestis.com/en/features',
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

export default function FeaturesPage() {
  const t = useTranslations('features');

  // Получаем массив профессиональных фич
  const proList = t.raw('sections.professionals.list') as string[];

  // Массив иконок и ключей для бейджей в секции "Atmosphere"
  const atmosphereBadges = [
    { icon: Layers, key: 'textures' },
    { icon: CloudLightning, key: 'rays' },
    { icon: GripHorizontal, key: 'decorations' },
    { icon: Palette, key: 'palettes' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />

      {/* Hero */}
      <header className="pt-32 pb-20 px-6 text-center border-b border-border/40 relative overflow-hidden">
        {/* Мягкий фоновый градиент для уюта */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t('hero.titleStart')} <br />
            <span className="text-muted-foreground italic font-serif">
              {t('hero.titleItalic')}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </header>

      {/* Section 1: Design System */}
      <section className="py-24 px-6 bg-muted/20 border-b border-border/40">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-16 text-center">
            {t('sections.designSystem.badge')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {/* Rigid Design */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight">{t('sections.designSystem.rigid.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('sections.designSystem.rigid.description')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-auto">
                <div className="rounded-2xl border border-border bg-background p-5 text-sm shadow-sm">
                  <p className="font-semibold mb-1.5">{t('sections.designSystem.rigid.handleTitle')}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t('sections.designSystem.rigid.handleDesc')}
                  </p>
                </div>
                <div className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-5 text-sm shadow-sm">
                  <p className="font-semibold mb-1.5 text-primary">{t('sections.designSystem.rigid.controlTitle')}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t('sections.designSystem.rigid.controlDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Depth + Decorations */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Palette className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight">{t('sections.designSystem.atmosphere.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('sections.designSystem.atmosphere.description')}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-6 mt-auto">
                {atmosphereBadges.map((item) => (
                  <div 
                    key={item.key} 
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-medium hover:border-primary/30 transition-colors shadow-sm"
                  >
                    <item.icon className="w-4 h-4 text-primary" />
                    {t(`sections.designSystem.atmosphere.badges.${item.key}`)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Platform */}
      <section className="py-24 px-6 border-b border-border/40">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 text-center">
            {t('sections.platform.badge')}
          </p>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{t('sections.platform.title')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto italic font-serif">
              {t('sections.platform.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-background border-border shadow-sm hover:border-primary/20 transition-colors">
              <CardContent className="p-8">
                <Zap className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">{t('sections.platform.cards.instant.title')}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('sections.platform.cards.instant.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border shadow-sm hover:border-primary/20 transition-colors">
              <CardContent className="p-8">
                <Maximize className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">{t('sections.platform.cards.responsive.title')}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('sections.platform.cards.responsive.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border shadow-sm hover:border-primary/20 transition-colors">
              <CardContent className="p-8">
                <Infinity className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">{t('sections.platform.cards.upToDate.title')}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('sections.platform.cards.upToDate.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

{/* Section 3: For Professionals (ОБНОВЛЕННАЯ СЕКЦИЯ) */}
      <section className="py-24 px-6 bg-gradient-to-b from-muted/10 to-muted/30 border-b border-border/40 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Левая колонка — Заголовки */}
            <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/15 backdrop-blur-sm">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  {t('sections.professionals.badge')}
                </span>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  {t('sections.professionals.title')}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {t('sections.professionals.description')}
                </p>
              </div>
            </div>

            {/* Правая колонка — Карточки для двух пунктов */}
            <div className="lg:col-span-7 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {proList
                  ?.filter((item: string) => !item.toLowerCase().includes('white label')) // Надежная фильтрация от white label
                  ?.map((item: string, index: number) => (
                    <div 
                      key={index} 
                      className="group relative flex flex-col justify-between p-6 bg-background border border-border/60 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 hover:bg-background/80 transition-all duration-300"
                    >
                      {/* Декоративный легкий светящийся элемент при ховере */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      
                      <div className="space-y-4 relative z-10">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                        <p className="text-sm sm:text-base font-medium text-foreground/90 leading-relaxed">
                          {item}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <footer className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-md mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{t('cta.title')}</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {t('cta.description')}
          </p>
          <CTAButton className="bg-foreground text-background px-10 py-4 rounded-full font-bold hover:opacity-90 transition-all active:scale-95 shadow-xl">
            {t('cta.button')}
          </CTAButton>
        </div>
      </footer>
      <Footer />
    </div>
  );
}