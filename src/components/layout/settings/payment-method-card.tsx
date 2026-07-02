"use client"

import { useState } from "react"
import { CreditCard, Calendar, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface PaymentMethodCardProps {
  paymentMethod: {
    type?: string
    last4?: string
    expiry?: string
    brand?: string
  }
}

export function PaymentMethodCard({ paymentMethod }: PaymentMethodCardProps) {
  const t = useTranslations("billing")
  const [loading, setLoading] = useState(false)

  const displayBrand = paymentMethod.brand === "default" || !paymentMethod.brand
    ? t("paymentMethodCard.defaultBrand")
    : paymentMethod.brand

  const displayType = paymentMethod.type || t("paymentMethodCard.defaultType")

  async function handleManage() {
    setLoading(true)
    try {
      const res = await fetch("/api/billing/portal", { method: "POST", credentials: "same-origin" })
      const data = await res.json() as { portalUrl?: string }
      if (data.portalUrl) {
        window.location.href = data.portalUrl
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 transition-all duration-300">
      {/* Левая часть: Иконка + Информация о карте */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground transition-all duration-300 shadow-xs mt-0.5">
          <CreditCard className="size-4.5 text-primary" />
        </div>

        <div className="space-y-1 min-w-0 w-full">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {t("paymentMethodCard.title")}
          </h3>

          {paymentMethod.last4 ? (
            <div className="text-xs text-muted-foreground/90 font-normal">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex h-5 items-center justify-center rounded-md bg-muted border border-border/60 px-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  {displayBrand}
                </div>
                <div className="flex items-center gap-1">
                  <span className="uppercase text-[11px] font-medium text-muted-foreground/80">
                    {displayType}
                  </span>
                  <span className="font-semibold text-foreground tabular-nums">•••• {paymentMethod.last4}</span>
                </div>
                <span className="text-muted-foreground/60">·</span>
                <div className="flex items-center gap-1 text-muted-foreground/80">
                  <Calendar className="size-3 text-muted-foreground/40" />
                  <span>
                    {t("paymentMethodCard.expiry", { date: paymentMethod.expiry ?? "" })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/70">{t("paymentMethodCard.manageDesc")}</p>
          )}
        </div>
      </div>

      {/* Правая часть: Кнопка управления */}
      <div className="shrink-0 border-t border-border/40 pt-4 md:pt-0 md:border-0">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full px-4 gap-1.5 bg-background/50"
          disabled={loading}
          onClick={handleManage}
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              <ExternalLink className="size-3 text-muted-foreground/70" />
              {t("paymentMethodCard.manage")}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}