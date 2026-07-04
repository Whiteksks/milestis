'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';
import { CTAButton } from '@/components/shared/cta-button';
import { Check, Zap, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useUserStore } from '@/hooks/useUserStore';
import { isPaidPlan, normalizePlanTier } from '@/lib/billing/billing.utils';

// ── Polar product IDs — set these in .env.local (sandbox) or production env vars.
// NEXT_PUBLIC_ prefix is intentional: product IDs are not secret.
// ── Checkout button: calls /api/billing/checkout and redirects ───────────────
function CheckoutButton({
  plan,
  interval,
  children,
  className,
}: {
  plan: 'creator' | 'archive';
  interval: 'month' | 'year';
  children: React.ReactNode;
  className?: string;
}) {
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ plan, interval }),
      });

      if (res.status === 401) {
        // Not authenticated → send to login
        router.push(`/${locale}/auth/login`);
        return;
      }

      const data = await res.json() as { checkoutUrl?: string };
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      // Network error — silent fail, button re-enables
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading
        ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
        : children}
    </button>
  );
}

export function PricingContent() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const [isYearly, setIsYearly] = useState(false);

  const { profile } = useUserStore(useShallow((s) => ({ profile: s.profile })))
  const activeTier = normalizePlanTier(profile?.subscription?.planTier)
  const isPaidActive = isPaidPlan(activeTier) && profile?.subscription?.status === 'active'
  const billingHref = `/${locale}/account/billing`

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
            isFree
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
            interval={isYearly ? 'year' : 'month'}
            planTier="creator"
            activeTier={isPaidActive ? activeTier : undefined}
            billingHref={billingHref}
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
            interval={isYearly ? 'year' : 'month'}
            planTier="archive"
            activeTier={isPaidActive ? activeTier : undefined}
            billingHref={billingHref}
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
  interval?: 'month' | 'year'
  isFree?: boolean
  planTier?: 'creator' | 'archive'
  activeTier?: string
  billingHref?: string
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
  badgeText,
  interval = 'month',
  isFree = false,
  planTier,
  activeTier,
  billingHref = '/account/billing',
}: PricingCardProps) => {
  const buttonClass = `w-full py-3 rounded-full font-bold transition-all active:scale-95 ${
    variant === 'default'
      ? 'bg-primary text-primary-foreground hover:opacity-90'
      : 'bg-background border border-border hover:bg-muted text-foreground'
  }`

  return (
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
      {isFree || !planTier ? (
        <CTAButton className={buttonClass}>
          {buttonText}
        </CTAButton>
      ) : activeTier && planTier ? (
        activeTier === planTier ? (
          <button className={`${buttonClass} opacity-60 cursor-default`} disabled>
            Current plan
          </button>
        ) : (
          <Link href={billingHref} className={`${buttonClass} text-center inline-flex items-center justify-center`}>
            Change plan
          </Link>
        )
      ) : (
        <CheckoutButton plan={planTier} interval={interval} className={buttonClass}>
          {buttonText}
        </CheckoutButton>
      )}
    </CardFooter>
  </Card>
  )
};