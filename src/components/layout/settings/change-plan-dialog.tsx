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
import { useTranslations } from "next-intl"
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

  function handleOpenChange(next: boolean) {
    if (next) setSelectedPlan(resolveInitialPlan(subscription?.planTier))
    onOpenChange(next)
  }

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
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none bg-background shadow-2xl rounded-3xl">
        <div className="grid md:grid-cols-[1.1fr_1fr] min-h-[520px]">

          {/* ── LEFT: Selector Panel ──────────────────────────── */}
          <div className="flex flex-col gap-6 p-8 justify-between">
            <div className="space-y-5">
              <div>
                <DialogTitle className="font-semibold text-lg tracking-tight text-foreground">
                  {t("planCard.changePlanTitle")}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1 font-light leading-relaxed">
                  {t("planCard.changePlanSubtitle")}
                </p>
              </div>

              {/* Interval Toggle */}
              <div className="inline-flex w-full p-1 bg-muted/60 rounded-xl border border-border/40 backdrop-blur-sm">
                {(["month", "year"] as Interval[]).map((iv) => (
                  <button
                    key={iv}
                    onClick={() => setInterval(iv)}
                    className={cn(
                      "flex-1 rounded-lg text-xs py-2 font-medium transition-all duration-200",
                      interval === iv
                        ? "bg-background shadow-sm text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {iv === "month" ? t("planCard.monthly") : `${t("planCard.yearly")} · −20%`}
                  </button>
                ))}
              </div>

              {/* Plan Cards */}
              <div className="flex flex-col gap-3">
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
                        "w-full text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden",
                        currentOption
                          ? "border-muted/60 bg-muted/20 opacity-60 cursor-not-allowed"
                          : isSelected
                          ? "border-primary bg-primary/[0.02] ring-2 ring-primary/10 shadow-sm"
                          : "border-border/80 hover:border-border-hover hover:bg-muted/30 cursor-pointer"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "size-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center shrink-0",
                            currentOption
                              ? "border-muted-foreground/20"
                              : isSelected
                              ? "border-primary"
                              : "border-muted-foreground/30"
                          )}>
                            {isSelected && <div className="size-2 rounded-full bg-primary animate-in fade-in zoom-in-75 duration-150" />}
                          </div>
                          
                          <span className="text-sm font-medium tracking-tight">{t(`plans.${plan}.name`)}</span>
                          
                          {currentOption && (
                            <span className="text-[10px] font-medium text-muted-foreground bg-muted border border-border/60 px-2 py-0.5 rounded-md">
                              {t("planCard.currentPlanBadge")}
                            </span>
                          )}
                          {plan === "creator" && !currentOption && (
                            <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                              Popular
                            </span>
                          )}
                        </div>
                        
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          ${price}<span className="text-xs font-normal text-muted-foreground/80">/mo</span>
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 ml-6 line-clamp-1 font-light">{t(`plans.${plan}.desc`)}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Policy Notes */}
            <div className="rounded-xl bg-muted/40 p-3.5 space-y-2 border border-border/20 text-[11px] text-muted-foreground/90 font-light">
              <p className="flex items-center gap-2">
                <span className="text-primary text-xs font-semibold">↑</span>
                {t("planCard.upgradePolicy")}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-semibold">↓</span>
                {t("planCard.downgradePolicy")}
              </p>
            </div>
          </div>

          {/* ── RIGHT: Features & CTA Panel ───────────────────── */}
          <div className="flex flex-col p-8 bg-muted/30 border-t md:border-t-0 md:border-l border-border/40 justify-between">
            <div className="animate-in fade-in-50 duration-200">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="text-2xl font-bold tracking-tight text-foreground transition-all">{t(`plans.${selectedPlan}.name`)}</h4>
                  {selectedPlan === "creator" && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight tabular-nums transition-all">
                    ${PLAN_PRICES[selectedPlan][interval === "year" ? "year" : "month"]}
                  </span>
                  <span className="text-sm text-muted-foreground/80 font-light">/month</span>
                </div>
                {interval === "year" && (
                  <p className="text-xs font-medium text-primary mt-1.5 animate-in slide-in-from-top-1 duration-200">
                    ${PLAN_PRICES[selectedPlan].yearlyTotal} {t("planCard.billedYearly")}
                  </p>
                )}
              </div>

              {/* Dynamic Feature List */}
              <ul className="space-y-3.5">
                {(pt.raw(`tiers.${selectedPlan}.features`) as string[]).map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm animate-in fade-in duration-300">
                    <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="size-2.5 text-primary stroke-[3]" />
                    </div>
                    <span className="text-muted-foreground font-light leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions Footer */}
            <div className="mt-8 pt-4 flex items-center justify-end gap-3">
              <DialogClose asChild>
                <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground hover:text-foreground px-4 py-2 text-xs">
                  {t("planCard.cancel")}
                </Button>
              </DialogClose>
              <Button
                size="sm"
                className="rounded-xl px-6 py-2 text-xs font-medium shadow-sm transition-all duration-200"
                disabled={loading || isCurrent}
                onClick={handleConfirm}
              >
                {loading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : isCurrent ? (
                  t("planCard.currentPlanBadge")
                ) : (
                  t("planCard.changePlanBtn")
                )}
              </Button>
            </div>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  )
}