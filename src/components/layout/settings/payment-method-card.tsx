"use client"

import { CreditCard, Calendar } from "lucide-react"
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
  // Переведено на плоскую структуру "billing"
  const t = useTranslations("billing")

  const displayBrand = paymentMethod.brand === "default" || !paymentMethod.brand 
    ? t("paymentMethodCard.defaultBrand") 
    : paymentMethod.brand

  const displayType = paymentMethod.type || t("paymentMethodCard.defaultType")

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
        </div>
      </div>

      <div className="shrink-0 hidden md:block w-8" />
    </div>
  )
}