"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useTranslations, useFormatter } from "next-intl"
import type { UserSubscription } from "@/lib/user"
import { useUserStore } from "@/hooks/useUserStore"

const PLAN_PRICES = {
  creator: { month: "59", year: "49", yearlyTotal: "490" },
  archive:  { month: "149", year: "124", yearlyTotal: "1240" },
} as const

type Interval = "month" | "year"
type PlanKey = "creator" | "archive"

interface ChangePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription?: UserSubscription | null
}

function resolveInitialPlan(planTier?: string | null): PlanKey {
  return planTier === "archive" ? "creator" : "archive"
}

export function ChangePlanDialog({ open, onOpenChange, subscription }: ChangePlanDialogProps) {
  const t = useTranslations("billing")
  const pt = useTranslations("pricing")
  const queryClient = useQueryClient()
  const uid = useUserStore((s) => s.profile?.uid ?? null)

  const currentPlanTier = subscription?.planTier
  const currentPlanInterval = subscription?.planInterval

  const [interval, setInterval] = useState<Interval>("month")
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>(() => resolveInitialPlan(subscription?.planTier))
  const [loading, setLoading] = useState(false)

  // Reset selection when dialog opens so it always reflects current state
  function handleOpenChange(next: boolean) {
    if (next) setSelectedPlan(resolveInitialPlan(subscription?.planTier))
    onOpenChange(next)
  }

  // isCurrent: compare tier + interval saved directly in Firestore.
  // planInterval is written by the webhook; fall back to tier-only match if missing.
  function isCurrentOption(plan: PlanKey, iv: Interval): boolean {
    if (!currentPlanTier) return false
    if (currentPlanInterval) return currentPlanTier === plan && currentPlanInterval === iv
    return currentPlanTier === plan
  }

  const isCurrent = isCurrentOption(selectedPlan, interval)

  async function handleConfirm() {
    setLoading(true)
    try {
      const res = await fetch("/api/billing/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ targetPlan: selectedPlan, interval }),
      })
      if (!res.ok) throw new Error()
      onOpenChange(false)
      if (uid) void queryClient.invalidateQueries({ queryKey: ['billing', uid, 'transactions'] })
      toast.success(t("planCard.changePlanSuccess"))
    } catch {
      toast.error(t("planCard.changePlanError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0">
        <div className="grid md:grid-cols-[2fr_3fr]">

          {/* ── LEFT: selector ──────────────────────────────── */}
          <div className="flex flex-col gap-5 p-6 border-b md:border-b-0 md:border-r border-border">
            <div>
              <DialogTitle className="font-semibold text-base">{t("planCard.changePlanTitle")}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{t("planCard.changePlanSubtitle")}</p>
            </div>

            {/* Interval toggle */}
            <div className="flex gap-1 p-1 bg-muted rounded-full border border-border/40">
              {(["month", "year"] as Interval[]).map((iv) => (
                <button
                  key={iv}
                  onClick={() => setInterval(iv)}
                  className={cn(
                    "flex-1 rounded-full text-xs py-1.5 font-medium transition-all",
                    interval === iv
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {iv === "month" ? t("planCard.monthly") : `${t("planCard.yearly")} · −20%`}
                </button>
              ))}
            </div>

            {/* Plan cards */}
            <div className="flex flex-col gap-2">
              {(["creator", "archive"] as PlanKey[]).map((plan) => {
                const currentOption = isCurrentOption(plan, interval)
                const isSelected = selectedPlan === plan && !currentOption
                const price = PLAN_PRICES[plan][interval === "year" ? "year" : "month"]

                return (
                  <button
                    key={plan}
                    disabled={currentOption}
                    onClick={() => setSelectedPlan(plan)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-2xl border transition-all",
                      currentOption
                        ? "border-primary/40 bg-primary/5 opacity-70 cursor-not-allowed"
                        : isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-muted/30 cursor-pointer"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "size-3.5 rounded-full border-2 transition-all shrink-0",
                          currentOption
                            ? "border-muted-foreground/30"
                            : isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/40"
                        )} />
                        <span className="text-sm font-semibold">{t(`plans.${plan}.name`)}</span>
                        {currentOption && (
                          <span className="text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded-full">
                            {t("planCard.currentPlanBadge")}
                          </span>
                        )}
                        {plan === "creator" && !currentOption && (
                          <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold tabular-nums">
                        ${price}<span className="text-xs font-normal text-muted-foreground">/mo</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 ml-5 line-clamp-1">{t(`plans.${plan}.desc`)}</p>
                  </button>
                )
              })}
            </div>

            {/* Policy note */}
            <div className="mt-auto rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1.5">
              <p className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <span className="text-primary font-bold leading-none mt-px">↑</span>
                {t("planCard.upgradePolicy")}
              </p>
              <p className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <span className="font-bold leading-none mt-px">↓</span>
                {t("planCard.downgradePolicy")}
              </p>
            </div>
          </div>

          {/* ── RIGHT: features preview ──────────────────────── */}
          <div className="flex flex-col p-6">
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-bold">{t(`plans.${selectedPlan}.name`)}</h4>
                {selectedPlan === "creator" && (
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tabular-nums">
                  ${PLAN_PRICES[selectedPlan][interval === "year" ? "year" : "month"]}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              {interval === "year" && (
                <p className="text-xs text-primary mt-0.5">
                  ${PLAN_PRICES[selectedPlan].yearlyTotal} {t("planCard.billedYearly")}
                </p>
              )}
            </div>

            <ul className="flex-1 space-y-2.5">
              {(pt.raw(`tiers.${selectedPlan}.features`) as string[]).map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="size-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  {t("planCard.cancel")}
                </Button>
              </DialogClose>
              <Button
                size="sm"
                className="rounded-full px-6"
                disabled={loading || isCurrent}
                onClick={handleConfirm}
              >
                {loading
                  ? <Loader2 className="size-3.5 animate-spin" />
                  : isCurrent
                  ? t("planCard.currentPlanBadge")
                  : t("planCard.changePlanBtn")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
