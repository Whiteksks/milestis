'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';
import { CTAButton } from '@/components/shared/cta-button';
import { Check, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';
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

<header className="px-6 pt-20 pb-8 md:pt-24">
  <div className="mx-auto max-w-5xl text-center">
    {/* Линии по бокам надзаголовка для красивого центрирования */}
    <div className="mb-4 flex items-center justify-center gap-4">
      <span className="h-px flex-1 bg-border" />
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
        {t('header.eyebrow')}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>

    {/* Заголовок */}
    <h1 className="mx-auto max-w-3xl font-serif text-4xl leading-tight tracking-tight text-balance md:text-6xl">
      {t('header.titleStart')}
      <span className="text-primary italic">
        {t('header.titleItalic')}
      </span>
      {t('header.titleEnd')}
    </h1>

    {/* Описание */}
    <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
      {t('header.description')}
    </p>
  </div>
</header>

      {/* Billing Period Toggle — flat Swiss control, no soft shadows/blur */}
      <div className="flex flex-col items-center justify-center gap-2 px-6 pb-6">
        <div className="inline-flex items-center rounded-full border border-border p-1">
          <button
            onClick={() => setIsYearly(false)}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors duration-200 ${
              !isYearly
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('labels.monthly')}
          </button>

          <button
            onClick={() => setIsYearly(true)}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors duration-200 ${
              isYearly
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('labels.yearly')}
          </button>
        </div>

        <div className="flex h-5 items-center justify-center">
          <span
            className={`font-mono text-xs uppercase tracking-widest text-primary transition-opacity duration-200 ${
              isYearly ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {t('labels.saveTwoMonths')}
          </span>
        </div>
      </div>

      <section id="plans" className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Explorer Tier */}
          <PricingCard
            number="01"
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
            number="02"
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
            number="03"
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
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-2xl border border-border/50 bg-muted/20 p-10 md:p-14">
          <div className="flex flex-col items-center gap-10 md:flex-row">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
                  {t('evergreenSection.badge')}
                </span>
              </div>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
                {t('evergreenSection.title')}
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {t('evergreenSection.description')}
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex min-w-[200px] flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background p-6">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <span className="text-center text-sm font-medium uppercase tracking-wide">
                  {t('evergreenSection.supportCard.title')}
                </span>
                <span className="text-center text-xs italic text-muted-foreground">
                  {t('evergreenSection.supportCard.subtitle')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

interface PricingCardProps {
  number: string
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
  number,
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
  const buttonClass = `w-full py-3 rounded-xs text-sm font-medium transition-colors ${
    variant === 'default'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'bg-transparent border border-border hover:bg-muted/40 text-foreground'
  }`

  return (
  <div
    className={`group relative flex h-full flex-col rounded-2xl p-8 transition-colors duration-300 ${
      isPopular
        ? 'bg-card border border-primary/30 shadow-md'
        : 'border border-border/40 bg-transparent hover:border-border hover:bg-muted/5'
    }`}
  >
    {/* Верхняя линия: номер плана и метка эмфазиса */}
    <div className="flex items-center justify-between">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
        {number}
      </span>
      {isPopular && badgeText && (
        <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-primary">
          {badgeText}
        </span>
      )}
    </div>

    <h3 className="mt-6 font-serif text-2xl font-medium tracking-tight text-foreground">
      {title}
    </h3>

    <div className="mt-4 flex items-baseline gap-1.5">
      <span className="font-mono text-4xl font-medium tabular-nums">
        {price === "--" ? "--" : `$${price}`}
      </span>
      <span className="text-sm text-muted-foreground">{perMonthLabel}</span>
    </div>

    {/* Зарезервированное место под лейбл, чтобы контент карточек не прыгал при переключении */}
    <div className="mt-1 h-5">
      {billedYearlyLabel && (
        <p className="font-mono text-xs uppercase tracking-wide text-primary">{billedYearlyLabel}</p>
      )}
    </div>

    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
      {description}
    </p>

    <ul className="mt-8 flex-1 space-y-4">
      {features?.map((feature: string) => (
        <li key={feature} className="flex items-start gap-3 text-sm">
          <Check className="w-4 h-4 text-foreground/40 shrink-0 mt-0.5" />
          <span className="text-foreground/80">{feature}</span>
        </li>
      ))}
    </ul>

    <div className="mt-8">
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
    </div>
  </div>
  )
};