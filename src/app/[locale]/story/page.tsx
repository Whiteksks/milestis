import React from 'react';
import type { Metadata } from 'next'
import { useTranslations } from 'next-intl';
import { CTAButton } from '@/components/shared/cta-button';
import { Heart, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Our Story',
    ru: 'Наша история',
    kz: 'Біздің тарих',
  }
  const descriptions: Record<string, string> = {
    en: 'Learn about the mission behind Milestis — building a platform to preserve and share life\'s most precious memories.',
    ru: 'Узнайте о миссии Milestis — платформе для сохранения и передачи самых ценных воспоминаний.',
    kz: 'Milestis миссиясы туралы біліңіз — қымбат естеліктерді сақтауға арналған платформа.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `https://milestis.com/${locale}/story`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': 'https://milestis.com/en/story',
        'ru': 'https://milestis.com/ru/story',
        'kk': 'https://milestis.com/kz/story',
        'x-default': 'https://milestis.com/en/story',
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

const MissionPage = () => {
  const t = useTranslations('MissionPage');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />
      
      {/* Hero Section */}
      <header className="relative pt-32 pb-24 px-6 border-b border-border/40 overflow-hidden">
        {/* Мягкое свечение в бэкграунде для премиальности */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{t('hero.badge')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-foreground leading-[1.1]">
            {t('hero.titleMain')} <br /> 
            <span className="text-muted-foreground italic font-serif font-normal">{t('hero.titleSub')}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>
      </header>

      {/* The Soul of the Project */}
      <article className="py-24 px-6 bg-muted/20 border-b border-border/40">
        <div className="max-w-4xl mx-auto"> {/* Сжали контейнер с 5xl до 4xl для баланса массы */}
          <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-center">
            
            {/* Левая колонка с текстом (занимает чуть больше места) */}
            <div className="md:col-span-3 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {t('soul.title')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('soul.description')}
              </p>
              
              <div className="space-y-5 pt-2">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-background rounded-xl border border-border shadow-sm text-primary shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base mb-0.5">{t('soul.features.stunning.title')}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('soul.features.stunning.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-background rounded-xl border border-border shadow-sm text-primary shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base mb-0.5">{t('soul.features.gift.title')}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('soul.features.gift.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка с цитатой (работает вместо фото) */}
            <div className="md:col-span-2 relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden border border-border bg-background shadow-sm flex items-center justify-center p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.02] via-transparent to-primary/[0.05]" />
              <div className="relative space-y-4">
                <Sparkles className="w-8 h-8 text-primary/40 mx-auto" />
                <p className="text-base md:text-lg font-serif italic text-foreground/90 leading-relaxed px-2">
                  "{t('soul.quote')}"
                </p>
              </div>
            </div>

          </div>
        </div>
      </article>

      {/* Speed & Simplicity */}
      <section className="py-24 px-6 border-b border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">{t('simplicity.title')}</h2>
            <p className="text-muted-foreground italic text-lg font-serif">{t('simplicity.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10 transition-colors group-hover:bg-primary/10">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('simplicity.features.speed.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                {t('simplicity.features.speed.description')}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10 transition-colors group-hover:bg-primary/10">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('simplicity.features.unbreakable.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                {t('simplicity.features.unbreakable.description')}
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10 transition-colors group-hover:bg-primary/10">
                <ArrowRight className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('simplicity.features.mobile.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                {t('simplicity.features.mobile.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <footer className="py-24 px-6">
        <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground overflow-hidden border-none relative shadow-xl rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <CardContent className="p-12 md:p-16 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 italic font-serif leading-tight">
              {t('cta.title')}
            </h2>
            <p className="text-primary-foreground/80 mb-10 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
              {t('cta.description')}
            </p>
            <CTAButton className="bg-background text-foreground px-12 py-4 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg active:scale-95">
              {t('cta.button')}
            </CTAButton>
          </CardContent>
        </Card>
      </footer>
      <Footer />
    </div>
  );
};

export default MissionPage;