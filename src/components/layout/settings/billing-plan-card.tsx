"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Sparkles, ShieldCheck, ArrowRight, Loader2, AlertTriangle, PauseCircle, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useLocale, useTranslations, useFormatter } from "next-intl"
import { useUserStore, selectSubscription } from "@/hooks/useUserStore"
import { getPlanTranslationKey, isPaidPlan } from "@/lib/billing/billing.utils"
import { ChangePlanDialog } from "./change-plan-dialog"

export function BillingPlanCard() {
  const t = useTranslations("billing")
  const format = useFormatter()
  const locale = useLocale()
  const queryClient = useQueryClient()
  const updateSubscription = useUserStore((s) => s.updateSubscription)
  const uid = useUserStore((s) => s.profile?.uid ?? null)
  const subscription = useUserStore(selectSubscription)

  const pricingHref = `/${locale}/pricing`
  const upgradeHref = pricingHref
  const compareHref = `${pricingHref}#plans`

  const planTier = subscription?.planTier
  const planKey = getPlanTranslationKey(planTier)
  const isPro = isPaidPlan(planTier)
  const displayPlanName = t(`plans.${planKey}.name`)
  const displayPlanDescription = t(`plans.${planKey}.desc`)

  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [changePlanOpen, setChangePlanOpen] = useState(false)

  const status = subscription?.status
  const cancelAtPeriodEnd = subscription?.cancelAtPeriodEnd ?? false

  // Firestore onSnapshot returns Timestamps, not JS Dates � handle both safely.
  function toSafeDate(val: unknown): Date | null {
    if (!val) return null
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val
    if (typeof (val as { toDate?: unknown }).toDate === "function") {
      return (val as { toDate: () => Date }).toDate()
    }
    const d = new Date(val as string)
    return isNaN(d.getTime()) ? null : d
  }

  const currentPeriodEnd = toSafeDate(subscription?.currentPeriodEnd)
  const formattedCancelDate = currentPeriodEnd
    ? format.dateTime(currentPeriodEnd, { month: "short", day: "numeric" })
    : null

  const isActiveNonCanceling = isPro && status === "active" && !cancelAtPeriodEnd
  const canCancel     = isActiveNonCanceling
  const canResume     = isPro && status === "active" && cancelAtPeriodEnd
  const canChangePlan = isActiveNonCanceling && (planTier === "creator" || planTier === "archive")

  async function handleCancel() {
    setCancelLoading(true)
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST", credentials: "same-origin" })
      if (!res.ok) throw new Error()
      setCancelOpen(false)
      if (subscription) updateSubscription({ ...subscription, cancelAtPeriodEnd: true })
      if (uid) void queryClient.invalidateQueries({ queryKey: ['billing', uid, 'transactions'] })
      toast.success(t("planCard.cancelSuccess"))
    } catch {
      toast.error(t("planCard.cancelError"))
    } finally {
      setCancelLoading(false)
    }
  }

  async function handleResume() {
    setResumeLoading(true)
    try {
      const res = await fetch("/api/billing/resume", { method: "POST", credentials: "same-origin" })
      if (!res.ok) throw new Error()
      if (subscription) updateSubscription({ ...subscription, cancelAtPeriodEnd: false })
      if (uid) void queryClient.invalidateQueries({ queryKey: ['billing', uid, 'transactions'] })
      toast.success(t("planCard.resumeSuccess"))
    } catch {
      toast.error(t("planCard.resumeError"))
    } finally {
      setResumeLoading(false)
    }
  }

  return (
    <>
      <div className={cn(
        "group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 transition-all duration-300",
        isPro && "bg-gradient-to-r from-card via-card to-primary/[0.02]"
      )}>
        {/* Left: icon + plan info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 shadow-xs mt-0.5",
            isPro && !cancelAtPeriodEnd
              ? "text-primary bg-primary/10 border-primary/20 group-hover:bg-primary/15"
              : isPro && cancelAtPeriodEnd
              ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
              : "text-muted-foreground bg-muted border-border group-hover:bg-muted/80"
          )}>
            {isPro ? (
              <Sparkles className="size-4.5 transition-transform duration-500 group-hover:rotate-12" />
            ) : (
              <ShieldCheck className="size-4.5" />
            )}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {displayPlanName}
              </h3>

              {isPro && !cancelAtPeriodEnd && status === "active" && (
                <span className="text-[10px] font-medium tracking-wide text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                  {t("planCard.activeBadge")}
                </span>
              )}
              {isPro && cancelAtPeriodEnd && (
                <span className="text-[10px] font-medium tracking-wide text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  {formattedCancelDate
                    ? t("planCard.cancelingOn", { date: formattedCancelDate })
                    : t("statuses.cancelsAtPeriodEnd")}
                </span>
              )}
              {isPro && status === "trialing" && (
                <span className="text-[10px] font-medium tracking-wide text-blue-600 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  {t("planCard.trialingBadge")}
                </span>
              )}
              {isPro && status === "past_due" && (
                <span className="text-[10px] font-medium tracking-wide text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <AlertTriangle className="size-2.5" />
                  {t("planCard.pastDueBadge")}
                </span>
              )}
              {isPro && status === "paused" && (
                <span className="text-[10px] font-medium tracking-wide text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <PauseCircle className="size-2.5" />
                  {t("planCard.pausedBadge")}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground/90 max-w-2xl font-normal line-clamp-2 md:line-clamp-1">
              {displayPlanDescription}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0 border-t border-border/40 pt-4 md:pt-0 md:border-0 justify-end flex-wrap">
          <Button asChild variant="ghost" size="sm" className="rounded-full px-4 text-muted-foreground hover:text-foreground group/link">
            <Link href={compareHref} className="gap-1">
              {t("planCard.viewPlans")}
              <ArrowRight className="size-3 text-muted-foreground/70 transition-transform duration-200 group-hover/link:translate-x-0.5" />
            </Link>
          </Button>

          {!isPro && (
            <Button asChild className="rounded-full gap-1.5 px-5 shadow-sm group/btn" size="sm">
              <Link href={upgradeHref}>
                <Sparkles className="size-3" />
                {t("planCard.upgrade")}
              </Link>
            </Button>
          )}

          {canChangePlan && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 gap-1.5 bg-background/50"
              onClick={() => setChangePlanOpen(true)}
            >
              <ArrowUpDown className="size-3" />
              {t("planCard.changePlan")}
            </Button>
          )}

          {canResume && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-5 bg-background/50"
              disabled={resumeLoading}
              onClick={handleResume}
            >
              {resumeLoading
                ? <Loader2 className="size-3.5 animate-spin" />
                : t("planCard.resumeSubscription")}
            </Button>
          )}

          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 text-muted-foreground hover:text-destructive"
              onClick={() => setCancelOpen(true)}
            >
              {t("planCard.cancelSubscription")}
            </Button>
          )}
        </div>
      </div>

      {/* Change plan dialog � extracted to its own component */}
      <ChangePlanDialog
        open={changePlanOpen}
        onOpenChange={setChangePlanOpen}
        subscription={subscription}
      />

      {/* Cancel confirmation dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("planCard.cancelConfirmTitle")}</DialogTitle>
            <DialogDescription>
              {formattedCancelDate
                ? t("planCard.cancelConfirmDesc", { date: formattedCancelDate })
                : t("planCard.cancelConfirmDescNoDate")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="rounded-full">
                {t("planCard.viewPlans")}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full"
              disabled={cancelLoading}
              onClick={handleCancel}
            >
              {cancelLoading
                ? <Loader2 className="size-3.5 animate-spin" />
                : t("planCard.cancelConfirmBtn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
