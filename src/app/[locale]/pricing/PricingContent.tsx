'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CTAButton } from '@/components/shared/cta-button';
import { Check, Zap, Star, ShieldCheck, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function PricingContent() {
  const t = useTranslations('pricing');
  const [isYearly, setIsYearly] = useState(false);

  const explorerFeatures = t.raw('tiers.explorer.features') as string[];
  const creatorFeatures = t.raw('tiers.creator.features') as string[];
  const archiveFeatures = t.raw('tiers.archive.features') as string[];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />

      <header className="pt-32 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t('header.titleStart')}
            <span className="text-muted-foreground italic font-serif">
              {t('header.titleItalic')}
            </span>
            {t('header.titleEnd')}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('header.description')}
          </p>
        </div>
      </header>

      {/* Улучшенный Billing Period Toggle */}
      <div className="flex flex-col items-center justify-center gap-3 pb-8 px-6">
        <div className="inline-flex items-center gap-1 bg-muted/80 p-1 rounded-full border border-border/40 backdrop-blur-sm shadow-inner relative">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${
              !isYearly
                ? 'bg-background text-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('labels.monthly')}
          </button>
          
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative z-10 flex items-center gap-1.5 ${
              isYearly
                ? 'bg-background text-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('labels.yearly')}
            {!isYearly && (
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-full border border-primary/20">
                -20%
              </span>
            )}
          </button>
        </div>

        <div className="h-6 flex items-center justify-center">
          <span 
            className={`inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full shadow-sm transition-all duration-300 ${
              isYearly ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <Zap className="w-3 h-3 fill-primary animate-pulse" />
            {t('labels.saveTwoMonths') ?? 'Скидка 20% включена'}
          </span>
        </div>
      </div>

      <section id="plans" className="py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Explorer Tier */}
          <PricingCard
            title={t('tiers.explorer.title')}
            price="0"
            perMonthLabel={t('labels.perMonth')}
            description={t('tiers.explorer.description')}
            features={explorerFeatures}
            buttonText={t('tiers.explorer.buttonText')}
            variant="outline"
          />

          {/* Creator Tier */}
          <PricingCard
            title={t('tiers.creator.title')}
            price={isYearly ? "49" : "59"}
            perMonthLabel={t('labels.perMonth')}
            billedYearlyLabel={isYearly ? `$490 ${t('labels.billedYearly')}` : undefined} 
            description={t('tiers.creator.description')}
            features={creatorFeatures}
            buttonText={t('tiers.creator.buttonText')}
            variant="default"
            isPopular={true}
            badgeText={t('tiers.creator.badge')}
          />

          {/* Archive Tier */}
          <PricingCard
            title={t('tiers.archive.title')}
            price={isYearly ? "124" : "149"}
            perMonthLabel={t('labels.perMonth')}
            billedYearlyLabel={isYearly ? `$1240 ${t('labels.billedYearly')}` : undefined}
            description={t('tiers.archive.description')}
            features={archiveFeatures}
            buttonText={t('tiers.archive.buttonText')}
            variant="outline"
          />
        </div>
      </section>

      {/* Evergreen & Support System */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-muted/30 rounded-[2.5rem] p-10 border border-border/50">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <RefreshCw className="w-5 h-5" />
                <span>{t('evergreenSection.badge')}</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {t('evergreenSection.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('evergreenSection.description')}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full md:w-auto">
              <Card className="bg-background p-6 border-border flex flex-col items-center gap-2 min-w-[200px]">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium text-center uppercase tracking-tighter">
                  {t('evergreenSection.supportCard.title')}
                </span>
                <span className="text-xs text-muted-foreground text-center italic">
                  {t('evergreenSection.supportCard.subtitle')}
                </span>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 text-center border-t border-border/40">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div className="flex gap-8 text-muted-foreground/60 grayscale">
            <ShieldCheck className="w-8 h-8" />
            <Zap className="w-8 h-8" />
            <Star className="w-8 h-8" />
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            {t('footer.text')}
          </p>
        </div>
      </footer>
      <Footer />
    </div>
  );
}

interface PricingCardProps {
  title: string
  price: string | number
  perMonthLabel: string
  billedYearlyLabel?: string
  description: string
  features: string[]
  buttonText: string
  variant?: string
  isPopular?: boolean
  badgeText?: string
}

const PricingCard = ({
  title,
  price,
  perMonthLabel,
  billedYearlyLabel,
  description,
  features,
  buttonText,
  variant,
  isPopular = false,
  badgeText
}: PricingCardProps) => (
  <Card className={`relative flex flex-col h-full bg-card border-border transition-all duration-300 hover:shadow-xl ${isPopular ? 'ring-2 ring-primary scale-105 z-10' : ''}`}>
    {isPopular && badgeText && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center justify-center text-center max-w-[85%] leading-tight">
        {badgeText}
      </div>
    )}
    <CardHeader className="p-8">
      <CardTitle className="text-xl font-bold mb-2">{title}</CardTitle>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-bold transition-all duration-200">
          {price === "--" ? "--" : `$${price}`}
        </span>
        <span className="text-muted-foreground text-sm">{perMonthLabel}</span>
      </div>
      
      {/* Зарезервированное место под лейбл, чтобы контент карточек не прыгал при переключении */}
      <div className="h-5 mb-3">
        {billedYearlyLabel ? (
          <p className="text-xs text-primary font-medium transition-all duration-200">{billedYearlyLabel}</p>
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </CardHeader>
    <CardContent className="p-8 pt-0 flex-grow">
      <ul className="space-y-4">
        {features?.map((feature: string) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="p-8 pt-0">
      <CTAButton className={`w-full py-3 rounded-full font-bold transition-all active:scale-95 ${
        variant === 'default'
          ? 'bg-primary text-primary-foreground hover:opacity-90'
          : 'bg-background border border-border hover:bg-muted text-foreground'
      }`}>
        {buttonText}
      </CTAButton>
    </CardFooter>
  </Card>
);