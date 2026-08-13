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
      <Button
        variant="default"
        size="lg"
        className="w-full h-9 gap-2 rounded-xs bg-foreground px-4 font-sans text-xs font-medium text-background transition-colors hover:bg-foreground/90"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4 shrink-0" />
        {t("topup.button")}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[400px] gap-0 p-6 rounded-xs border border-border bg-card antialiased">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="font-serif text-xl font-medium tracking-tight text-foreground">
              {t("topup.dialogTitle")}
            </DialogTitle>
            <DialogDescription className="font-sans text-xs text-muted-foreground">
              {t("topup.dialogDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-5">
            {/* Информационный бейдж рейта */}
            <div className="flex items-center justify-start">
              {isPremiumRate ? (
                <div className="flex items-center gap-1.5 rounded-xs bg-secondary/50 border border-border px-2.5 py-1 text-foreground">
                  <Zap className="size-3.5 fill-current" />
                  <span className="font-sans text-[11px] font-medium">
                    {t("topup.rateNotePremium", { rate: ratePerDollar })}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-xs bg-secondary/50 border border-border px-2.5 py-1 text-muted-foreground">
                  <Sparkles className="size-3.5" />
                  <span className="font-sans text-[11px] font-medium">
                    {t("topup.rateNote", { rate: ratePerDollar })}
                  </span>
                </div>
              )}
            </div>

            {/* Главное табло: Кредиты и Стоимость */}
            <div className="rounded-xs border border-border bg-background p-5 flex flex-col items-center justify-center relative">
              <span className="font-sans text-[10px] font-medium tracking-wider uppercase text-muted-foreground mb-1">
                {t("topup.creditLabel")}
              </span>
              <span className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-foreground">
                {credits.toLocaleString()}
              </span>
              <div className="mt-3 px-2.5 py-0.5 rounded-xs bg-secondary/50 border border-border font-mono text-xs font-medium text-foreground tabular-nums">
                {priceDisplay}
              </div>
            </div>

            {/* Слайдер */}
            <div className="space-y-2 px-0.5">
              <Slider
                min={MIN_CREDITS}
                max={MAX_CREDITS}
                step={STEP}
                value={[credits]}
                onValueChange={([val]) => setCredits(val)}
                className="py-2 cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[11px] text-muted-foreground tabular-nums">
                <span className="hover:text-foreground cursor-pointer transition-colors" onClick={() => !loading && setCredits(MIN_CREDITS)}>{MIN_CREDITS}</span>
                <span className="hover:text-foreground cursor-pointer transition-colors" onClick={() => !loading && setCredits(500)}>500</span>
                <span className="hover:text-foreground cursor-pointer transition-colors" onClick={() => !loading && setCredits(MAX_CREDITS)}>{MAX_CREDITS.toLocaleString()}</span>
              </div>
            </div>

            {/* Ошибка запроса */}
            {error && (
              <div className="p-3 rounded-xs bg-destructive/10 border border-destructive/20 text-center">
                <p className="font-sans text-xs font-medium text-destructive">{error}</p>
              </div>
            )}

            {/* Кнопка действия */}
            <Button
              className="w-full h-9 rounded-xs bg-foreground px-4 font-sans text-xs font-medium text-background transition-colors hover:bg-foreground/90"
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