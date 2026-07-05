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
      {/* Улучшенный триггер: теперь это полноценная адаптивная кнопка для размещения вне карточки */}
      <Button
        variant="default"
        size="lg"
        className="w-full h-11 gap-2 rounded-2xl text-xs font-semibold tracking-wide shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4 shrink-0" />
        {t("topup.button")}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        {/* Ограничиваем максимальную ширину окна до аккуратных sm:max-w-[400px], чтобы оно не казалось пустым */}
        <DialogContent className="sm:max-w-[400px] gap-0 p-6 rounded-3xl border border-border bg-card shadow-lg antialiased">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="font-serif text-xl font-medium tracking-tight">
              {t("topup.dialogTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground/90 leading-normal">
              {t("topup.dialogDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-5">
            {/* Информационный бейдж рейта */}
            <div className="flex items-center justify-start">
              {isPremiumRate ? (
                <div className="flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-2.5 py-1 text-primary">
                  <Zap className="size-3.5 fill-current" />
                  <span className="text-[11px] font-bold tracking-wide">
                    {t("topup.rateNotePremium", { rate: ratePerDollar })}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-xl bg-muted border border-border/60 px-2.5 py-1 text-muted-foreground">
                  <Sparkles className="size-3.5" />
                  <span className="text-[11px] font-medium tracking-wide">
                    {t("topup.rateNote", { rate: ratePerDollar })}
                  </span>
                </div>
              )}
            </div>

            {/* Главное табло: Кредиты и Стоимость объединены в один аккуратный блок */}
            <div className="rounded-2xl border border-border bg-muted/30 p-5 flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/80 mb-1">
                {t("topup.creditLabel")}
              </span>
              <span className="text-5xl font-extrabold tabular-nums tracking-tight text-foreground">
                {credits.toLocaleString()}
              </span>
              <div className="mt-3 px-3 py-0.5 rounded-lg bg-background border border-border/50 text-xs font-semibold text-muted-foreground shadow-xs tabular-nums">
                {priceDisplay}
              </div>
            </div>

            {/* Контейнер интерактивного слайдера */}
            <div className="space-y-2.5 px-0.5">
              <Slider
                min={MIN_CREDITS}
                max={MAX_CREDITS}
                step={STEP}
                value={[credits]}
                onValueChange={([val]) => setCredits(val)}
                className="py-2 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground/80 font-medium tabular-nums">
                <span className="hover:text-foreground transition-colors" onClick={() => !loading && setCredits(MIN_CREDITS)}>{MIN_CREDITS}</span>
                <span className="hover:text-foreground transition-colors" onClick={() => !loading && setCredits(500)}>500</span>
                <span className="hover:text-foreground transition-colors" onClick={() => !loading && setCredits(MAX_CREDITS)}>{MAX_CREDITS.toLocaleString()}</span>
              </div>
            </div>

            {/* Ошибка запроса */}
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
                <p className="text-xs font-medium text-destructive">{error}</p>
              </div>
            )}

            {/* Главная кнопка отправки формы */}
            <Button
              className="w-full h-11 text-xs font-semibold tracking-wide rounded-2xl shadow-xs"
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