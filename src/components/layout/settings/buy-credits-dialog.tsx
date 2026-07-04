"use client"

import { useState } from "react"
import { Plus, Loader2, Sparkles, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { selectSubscription, useUserStore } from "@/hooks/useUserStore"
import { getEffectiveSubscriptionFeatures } from "@/lib/billing/billing.utils"

const MIN_CREDITS = 50
const MAX_CREDITS = 1000
const STEP = 10
const DEFAULT_CREDITS = 100

export function BuyCreditsDialog() {
  const t = useTranslations("billing")
  const [open, setOpen] = useState(false)
  const [credits, setCredits] = useState(DEFAULT_CREDITS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subscription = useUserStore(selectSubscription)
  const ratePerDollar = getEffectiveSubscriptionFeatures(subscription).creditTopupRatePerDollar || 1
  const isPremiumRate = ratePerDollar > 1

  // Price in dollars, rounded to 2 decimal places
  const priceDollars = credits / ratePerDollar
  const priceDisplay = Number.isInteger(priceDollars)
    ? `$${priceDollars}`
    : `$${priceDollars.toFixed(2)}`

  const handleBuy = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/billing/buy-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ credits }),
      })

      if (!res.ok) {
        setError(t("topup.error"))
        return
      }

      const data = await res.json() as { checkoutUrl?: string }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch {
      setError(t("topup.error"))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!loading) {
      setOpen(value)
      if (!value) {
        setCredits(DEFAULT_CREDITS)
        setError(null)
      }
    }
  }

  return (
    <>
      {/* Trigger: small button placed inline */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1 rounded-full px-2.5 text-[11px] font-semibold tracking-wide border-border/60 bg-background/60 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-3" />
        {t("topup.button")}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{t("topup.dialogTitle")}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("topup.dialogDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-6">
            {/* Rate badge */}
            <div className="flex items-center gap-2">
              {isPremiumRate ? (
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1">
                  <Zap className="size-3 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    {t("topup.rateNotePremium", { rate: ratePerDollar })}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-muted border border-border/60 px-3 py-1">
                  <Sparkles className="size-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {t("topup.rateNote", { rate: ratePerDollar })}
                  </span>
                </div>
              )}
            </div>

            {/* Credit amount display */}
            <div className="rounded-2xl bg-muted/40 border border-border/60 p-5 text-center">
              <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1">
                {t("topup.creditLabel")}
              </p>
              <p className="text-5xl font-bold tabular-nums tracking-tight">
                {credits.toLocaleString()}
              </p>
            </div>

            {/* Slider */}
            <div className="px-1 space-y-3">
              <Slider
                min={MIN_CREDITS}
                max={MAX_CREDITS}
                step={STEP}
                value={[credits]}
                onValueChange={([val]) => setCredits(val)}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>{MIN_CREDITS}</span>
                <span>500</span>
                <span>{MAX_CREDITS.toLocaleString()}</span>
              </div>
            </div>

            {/* Price summary */}
            <div className="rounded-xl border border-border/60 bg-card divide-y divide-border/60">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm text-muted-foreground">{t("topup.creditLabel")}</span>
                <span className="text-sm font-semibold tabular-nums">{credits.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm font-semibold">{t("topup.priceTitle")}</span>
                <span className="text-lg font-bold tabular-nums">{priceDisplay}</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            {/* Buy button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleBuy}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  {t("topup.buyingButton")}
                </>
              ) : (
                t("topup.buyButton", { credits: credits.toLocaleString(), price: priceDollars.toFixed(2) })
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
