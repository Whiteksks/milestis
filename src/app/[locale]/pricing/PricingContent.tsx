'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { CTAButton } from '@/components/shared/cta-button';
import { Check, ShieldCheck, RefreshCw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useUserStore } from '@/hooks/useUserStore';
import { isPaidPlan, normalizePlanTier } from '@/lib/billing/billing.utils';

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
        router.push(`/${locale}/auth/login`);
        return;
      }

      const data = (await res.json()) as { checkoutUrl?: string };
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      // Network error silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : children}
    </button>
  );
}

export function PricingContent() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const [isYearly, setIsYearly] = useState(false);

  const { profile } = useUserStore(useShallow((s) => ({ profile: s.profile })));
  const activeTier = normalizePlanTier(profile?.subscription?.planTier);
  const isPaidActive = isPaidPlan(activeTier) && profile?.subscription?.status === 'active';
  const billingHref = `/${locale}/account/billing`;

  const explorerFeatures = t.raw('tiers.explorer.features') as string[];
  const creatorFeatures = t.raw('tiers.creator.features') as string[];
  const archiveFeatures = t.raw('tiers.archive.features') as string[];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />

      {/* Hero section — Compact spacing for above-the-fold visibility */}
      <header className="px-6 pt-20 pb-6 md:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-border md:w-20" />
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              {t('header.eyebrow')}
            </span>
            <span className="h-px w-12 bg-border md:w-20" />
          </div>

          <h1 className="mx-auto max-w-3xl font-serif text-3xl leading-[1.15] tracking-tight text-balance md:text-5xl">
            {t('header.titleStart')}{' '}
            <span className="italic text-primary">{t('header.titleItalic')}</span>{' '}
            {t('header.titleEnd')}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('header.description')}
          </p>
        </div>
      </header>

      {/* Billing Period Toggle — Compact Swiss control */}
      <div className="flex flex-col items-center justify-center gap-2 px-6 pb-4">
        <div className="inline-flex items-center rounded-xs border border-border bg-background p-1">
          <button
            onClick={() => setIsYearly(false)}
            className={`rounded-xs px-5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
              !isYearly
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('labels.monthly')}
          </button>

          <button
            onClick={() => setIsYearly(true)}
            className={`rounded-xs px-5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
              isYearly
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('labels.yearly')}
          </button>
        </div>

        <div className="h-6">
          <span
            className={`font-mono text-[11px] uppercase tracking-widest text-primary transition-opacity duration-200 ${
              isYearly ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {t('labels.saveTwoMonths')}
          </span>
        </div>
      </div>

      {/* Pricing Grid */}
      <section id="plans" className="px-2 md:px-6 pb-20">
        {(() => {
          const plans: Array<{ key: string } & PricingCardProps> = [
            {
              key: 'explorer',
              number: '01',
              title: t('tiers.explorer.title'),
              price: '0',
              perMonthLabel: t('labels.perMonth'),
              description: t('tiers.explorer.description'),
              features: explorerFeatures,
              buttonText: t('tiers.explorer.buttonText'),
              variant: 'outline',
              isFree: true,
            },
            {
              key: 'creator',
              number: '02',
              title: t('tiers.creator.title'),
              price: isYearly ? '49' : '59',
              perMonthLabel: t('labels.perMonth'),
              billedYearlyLabel: isYearly ? `$490 ${t('labels.billedYearly')}` : undefined,
              description: t('tiers.creator.description'),
              features: creatorFeatures,
              buttonText: t('tiers.creator.buttonText'),
              variant: 'default',
              isPopular: true,
              badgeText: t('tiers.creator.badge'),
              interval: isYearly ? 'year' : 'month',
              planTier: 'creator',
              activeTier: isPaidActive ? activeTier : undefined,
              billingHref,
            },
            {
              key: 'archive',
              number: '03',
              title: t('tiers.archive.title'),
              price: isYearly ? '124' : '149',
              perMonthLabel: t('labels.perMonth'),
              billedYearlyLabel: isYearly ? `$1240 ${t('labels.billedYearly')}` : undefined,
              description: t('tiers.archive.description'),
              features: archiveFeatures,
              buttonText: t('tiers.archive.buttonText'),
              variant: 'outline',
              interval: isYearly ? 'year' : 'month',
              planTier: 'archive',
              activeTier: isPaidActive ? activeTier : undefined,
              billingHref,
            },
          ];
          const initialSlide = plans.findIndex((p) => p.key === 'creator');

          return (
            <>
              {/* Mobile — swipeable carousel, centered on Creator by default */}
              <div className="relative md:hidden [&_.swiper-pagination-bullet]:bg-primary/25 [&_.swiper-pagination-bullet-active]:bg-primary">
                <Swiper
                  key={isYearly ? 'yearly' : 'monthly'}
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation={{ prevEl: '.pricing-swiper-prev', nextEl: '.pricing-swiper-next' }}
                  centeredSlides
                  slidesPerView={1.08}
                  spaceBetween={16}
                  initialSlide={initialSlide}
                  grabCursor
                  className="!pb-10"
                >
                  {plans.map(({ key, ...cardProps }) => (
                    <SwiperSlide key={key} className="h-auto py-2">
                      <PricingCard {...cardProps} />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Subtle hint arrows — signal there's more content to swipe */}
                <button
                  aria-label={t('labels.previousPlan')}
                  className="pricing-swiper-prev absolute left-1 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-opacity duration-200 [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-0"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  aria-label={t('labels.nextPlan')}
                  className="pricing-swiper-next absolute right-1 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-opacity duration-200 [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-0"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Desktop — static three-column grid */}
              <div className="mx-auto hidden max-w-6xl grid-cols-1 items-stretch gap-8 md:grid md:grid-cols-3">
                {plans.map(({ key, ...cardProps }) => (
                  <PricingCard key={key} {...cardProps} />
                ))}
              </div>
            </>
          );
        })()}
      </section>

      {/* Evergreen & Support Section — High-contrast block matching Manifesto style */}
      <section className="bg-foreground px-6 py-20 text-background">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="space-y-4 md:col-span-8">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-4 w-4 text-background/70" />
                <span className="font-mono text-xs font-medium uppercase tracking-widest text-background/60">
                  {t('evergreenSection.badge')}
                </span>
              </div>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-background md:text-4xl">
                {t('evergreenSection.title')}
              </h2>
              <p className="max-w-2xl leading-relaxed text-background/70">
                {t('evergreenSection.description')}
              </p>
            </div>

            <div className="md:col-span-4">
              <div className="flex flex-col items-center gap-3 rounded-xl border border-background/20 bg-background/5 p-6 text-center backdrop-blur-xs">
                <ShieldCheck className="h-8 w-8 text-background/90" />
                <span className="font-mono text-xs uppercase tracking-widest text-background">
                  {t('evergreenSection.supportCard.title')}
                </span>
                <span className="font-serif text-xs italic text-background/60">
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
  number: string;
  title: string;
  price: string | number;
  perMonthLabel: string;
  billedYearlyLabel?: string;
  description: string;
  features: string[];
  buttonText: string;
  variant?: string;
  isPopular?: boolean;
  badgeText?: string;
  interval?: 'month' | 'year';
  isFree?: boolean;
  planTier?: 'creator' | 'archive';
  activeTier?: string;
  billingHref?: string;
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
  }`;

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl p-8 transition-colors duration-300 ${
        isPopular
          ? 'border-2 border-primary/40 bg-card shadow-sm'
          : 'border border-border/60 bg-transparent hover:border-border hover:bg-muted/5'
      }`}
    >
      {/* Swiss numeral watermark in background */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 select-none font-serif text-8xl italic text-foreground/5"
      >
        {number}
      </span>

      {/* Meta header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          {number}
        </span>
        {isPopular && badgeText && (
          <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-primary">
            {badgeText}
          </span>
        )}
      </div>

      <h3 className="relative z-10 mt-6 font-serif text-2xl font-medium tracking-tight text-foreground">
        {title}
      </h3>

      <div className="relative z-10 mt-4 flex items-baseline gap-1.5">
        <span className="font-mono text-4xl font-medium tabular-nums">
          {price === '--' ? '--' : `$${price}`}
        </span>
        <span className="text-sm text-muted-foreground">{perMonthLabel}</span>
      </div>

      <div className="relative z-10 mt-1 h-5">
        {billedYearlyLabel && (
          <p className="font-mono text-xs uppercase tracking-wide text-primary">
            {billedYearlyLabel}
          </p>
        )}
      </div>

      <p className="relative z-10 mt-3 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <ul className="relative z-10 mt-8 flex-1 space-y-4 border-t border-border/40 pt-6">
        {features?.map((feature: string) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground/40" />
            <span className="text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-8">
        {isFree || !planTier ? (
          <CTAButton className={buttonClass}>{buttonText}</CTAButton>
        ) : activeTier && planTier ? (
          activeTier === planTier ? (
            <button className={`${buttonClass} opacity-60 cursor-default`} disabled>
              Current plan
            </button>
          ) : (
            <Link href={billingHref} className={`${buttonClass} inline-flex items-center justify-center text-center`}>
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
  );
};