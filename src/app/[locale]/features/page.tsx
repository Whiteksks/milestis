import React from 'react';
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
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

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
      <header className="pt-32 pb-16 px-6 text-center border-b border-border/40">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t('hero.titleStart')} <br />
            <span className="text-muted-foreground italic font-serif">
              {t('hero.titleItalic')}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('hero.description')}
          </p>
        </div>
      </header>

      {/* Section 1: Design System */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border/40">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-16 text-center">
            {t('sections.designSystem.badge')}
          </p>

          {/* Rigid Design */}
          <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl">{t('sections.designSystem.rigid.title')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('sections.designSystem.rigid.description')}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border border-border bg-card p-4 text-sm">
                  <p className="font-semibold mb-1">{t('sections.designSystem.rigid.handleTitle')}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t('sections.designSystem.rigid.handleDesc')}
                  </p>
                </div>
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
                  <p className="font-semibold mb-1 text-primary">{t('sections.designSystem.rigid.controlTitle')}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t('sections.designSystem.rigid.controlDesc')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full aspect-video bg-muted/30 rounded-3xl border border-border flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <ShieldCheck className="w-12 h-12 text-muted-foreground/20" />
            </div>
          </div>

          {/* Visual Depth + Decorations */}
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Palette className="w-6 h-6" />
              </div>
              <h2 className="text-3xl">{t('sections.designSystem.atmosphere.title')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('sections.designSystem.atmosphere.description')}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-4">
                {atmosphereBadges.map((item) => (
                  <div 
                    key={item.key} 
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-sm font-medium hover:border-primary/30 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-primary" />
                    {t(`sections.designSystem.atmosphere.badges.${item.key}`)}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full aspect-video bg-muted/30 rounded-3xl border border-border flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tl from-primary/10 to-transparent opacity-50" />
              <Layers className="w-12 h-12 text-muted-foreground/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Platform */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 text-center">
            {t('sections.platform.badge')}
          </p>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('sections.platform.title')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto italic font-serif">
              {t('sections.platform.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-background border-border shadow-sm">
              <CardContent className="p-8">
                <Zap className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">{t('sections.platform.cards.instant.title')}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('sections.platform.cards.instant.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border shadow-sm">
              <CardContent className="p-8">
                <Maximize className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">{t('sections.platform.cards.responsive.title')}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('sections.platform.cards.responsive.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border shadow-sm">
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

      {/* Section 3: For Professionals */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border/40">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-16 text-center">
            {t('sections.professionals.badge')}
          </p>

          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-3xl">{t('sections.professionals.title')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('sections.professionals.description')}
              </p>
              <ul className="space-y-3">
                {proList?.map((item: string) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full aspect-video bg-muted/30 rounded-3xl border border-border flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <Briefcase className="w-12 h-12 text-muted-foreground/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <footer className="py-24 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('cta.title')}</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {t('cta.description')}
        </p>
        <CTAButton className="bg-foreground text-background px-10 py-4 rounded-full font-bold hover:opacity-90 transition-all active:scale-95 shadow-xl">
          {t('cta.button')}
        </CTAButton>
      </footer>
      <Footer />
    </div>
  );
}