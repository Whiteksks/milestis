'use client'

import { useLocale, useTranslations, useNow } from 'next-intl'
import { Coins, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MENU_PLANS, getMenuPlan, hasMenuAccess, type MenuBilling, type MenuPlanId } from '../../../../functions/src/projects/menu/billing/model'
import type { MenuBillingReview } from '@/lib/projects/menu-billing-api'

function useBillingDate() {
  const locale = useLocale()
  return (date: number) => new Intl.DateTimeFormat(locale === 'kz' ? 'kk' : locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
}

export function MenuBillingStatusPanel({ billing, busy, onAutoRenew }: {
  billing: MenuBilling; busy: boolean; onAutoRenew: (enabled: boolean) => void
}) {
  const t = useTranslations('editor.menu.billing')
  const date = useBillingDate()
  const now = useNow({ updateInterval: 60_000 }).getTime()
  const active = hasMenuAccess(billing, now)
  return <section className="space-y-3 rounded-xl border bg-muted/20 p-4" aria-label={t('title')}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="flex items-center gap-2 text-sm font-medium"><Coins className="size-4" />{t('title')}</h3>
      <span className={active ? 'text-xs text-muted-foreground' : 'text-xs text-destructive'}>{t(active ? billing.periodEndMillis > now ? 'active' : 'grace' : 'inactive')}</span>
    </div>
    <p className="text-sm">{t('usage', { count: billing.photoCount, limit: getMenuPlan(billing.planId).photoLimit })}</p>
    <p className="text-xs text-muted-foreground">{t('paidUntil', { date: date(billing.periodEndMillis) })}</p>
    <p className="text-xs text-muted-foreground">{billing.autoRenew
      ? t('next', { amount: getMenuPlan(billing.nextPlanId).monthlyCredits, date: date(billing.periodEndMillis) })
      : t('canceled')}</p>
    {(billing.autoRenew || billing.periodEndMillis > now) && <Button variant="outline" size="sm" disabled={busy} onClick={() => onAutoRenew(!billing.autoRenew)}>
      {t(billing.autoRenew ? 'cancelRenewal' : 'resumeRenewal')}
    </Button>}
  </section>
}

export function MenuBillingReviewPanel({ review, busy, accepted, onAccept, onPlan, onRefresh }: {
  review: MenuBillingReview; busy: boolean; accepted: boolean; onAccept: (value: boolean) => void
  onPlan: (id: MenuPlanId) => void; onRefresh: () => void
}) {
  const t = useTranslations('editor.menu.billing')
  const locale = useLocale()
  const date = useBillingDate()
  const insufficient = review.availableCredits < review.amount
  return <section className="space-y-4" aria-label={t('review')}>
    <fieldset disabled={busy} className="space-y-3">
      <legend className="text-sm font-medium">{t('photos', { count: review.photoCount })}</legend>
      <p className="text-xs leading-relaxed text-muted-foreground">{t('countHint')}</p>
      <div className="grid grid-cols-2 gap-2">
        {MENU_PLANS.map((plan) => <label key={plan.id} className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-sm transition-colors has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40 ${review.planId === plan.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'}`}>
          <input type="radio" name="menu-plan" className="mt-1 accent-primary" value={plan.id} checked={review.planId === plan.id} disabled={review.photoCount > plan.photoLimit}
            onChange={() => onPlan(plan.id)} />
          <span><span className="block font-medium">{t('limit', { count: plan.photoLimit })}</span><span className="mt-1 block text-xs text-muted-foreground">{t('monthly', { amount: plan.monthlyCredits })}</span></span>
        </label>)}
      </div>
    </fieldset>
    <div className="space-y-2 rounded-xl bg-muted/40 p-4 text-sm" aria-live="polite">
      <div className="flex items-center justify-between gap-3"><span>{t('chargeNow')}</span><strong>{t('credits', { amount: review.amount })}</strong></div>
      <div className="flex items-center justify-between gap-3 text-muted-foreground"><span>{t('available')}</span><span>{t('credits', { amount: review.availableCredits })}</span></div>
      <p className="border-t pt-2 text-xs text-muted-foreground">{review.billing.autoRenew
        ? t('next', { amount: getMenuPlan(review.billing.nextPlanId).monthlyCredits, date: date(review.billing.periodEndMillis) })
        : t('canceled')}</p>
      {review.current && review.current.periodEndMillis === review.billing.periodEndMillis && review.amount > 0 && <p className="text-xs text-muted-foreground">{t('upgradeHint')}</p>}
      {review.billing.planId !== review.billing.nextPlanId && <p className="text-xs text-muted-foreground">{t('downgradeHint', { date: date(review.billing.periodEndMillis) })}</p>}
    </div>
    {insufficient && <div role="alert" className="space-y-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
      <p>{t('insufficient', { amount: review.amount - review.availableCredits })}</p>
      <Button variant="outline" size="sm" asChild><a href={`/${locale}/account/billing`} target="_blank" rel="noopener noreferrer">{t('topup')}</a></Button>
    </div>}
    {review.amount > 0 && <label className="flex items-start gap-3 text-xs leading-relaxed">
      <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-primary" checked={accepted} disabled={busy} onChange={(event) => onAccept(event.target.checked)} />
      <span>{t(review.billing.autoRenew ? 'consent' : 'consentOnce', { amount: review.amount, monthly: getMenuPlan(review.billing.nextPlanId).monthlyCredits })}</span>
    </label>}
    <Button variant="ghost" size="sm" disabled={busy} onClick={onRefresh}><RefreshCw className="size-3.5" />{t('refresh')}</Button>
  </section>
}
