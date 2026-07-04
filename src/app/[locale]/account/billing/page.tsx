"use client"

import { BillingPlanCard } from "@/components/layout/settings/billing-plan-card"
import { PaymentMethodCard } from "@/components/layout/settings/payment-method-card"
import { BillingHistory } from "@/components/layout/settings/billing-history"
import { BuyCreditsDialog } from "@/components/layout/settings/buy-credits-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { useBilling } from "@/hooks/useBilling"
import { Sparkles, Gift, ShoppingBag, CreditCard } from "lucide-react"
import { useTranslations } from "next-intl"

export default function BillingSettings() {
  const t = useTranslations("billing")
  
  const {
    loading,
    historyLoading,
    historyError,
    creditsData,
    isPro,
    creditHistory,
    invoiceHistory,
  } = useBilling()

  if (loading) {
    return (
      <div className="space-y-12 max-w-5xl mx-auto py-6">
        <section className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-lg" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-48 rounded-3xl lg:col-span-2" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
        </section>
      </div>
    )
  }

  // Вычисления для кредитного дашборда
  // totalCredits uses actual balance values (not capped periodTotal) so it matches Firestore.
  const totalCredits = creditsData 
    ? creditsData.monthly.balance + creditsData.bonus.amount + creditsData.purchased.amount
    : 0
  const monthlyPercentage = creditsData && creditsData.monthly.total > 0 
    ? (creditsData.monthly.used / creditsData.monthly.total) * 100 
    : 0

  const creditTypes = creditsData ? [
    {
      icon: Sparkles,
      labelKey: creditsData.monthly.interval === 'year'
        ? "credits.items.yearly.label"
        : "credits.items.monthly.label",
      value: creditsData.monthly.balance,
      subKey: creditsData.monthly.interval === 'year'
        ? "credits.items.yearly.sub"
        : "credits.items.monthly.sub",
      subVars: { total: creditsData.monthly.total, resetDate: creditsData.monthly.resetDate },
      progress: monthlyPercentage,
      iconClass: "text-primary bg-primary/10 border-primary/20",
    },
    {
      icon: Gift,
      labelKey: "credits.items.bonus.label",
      value: creditsData.bonus.amount,
      subKey: "credits.items.bonus.sub",
      progress: null,
      iconClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: ShoppingBag,
      labelKey: "credits.items.purchased.label",
      value: creditsData.purchased.amount,
      subKey: "credits.items.purchased.sub",
      progress: null,
      iconClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
  ] : []

  return (
    <div className="space-y-12 max-w-5xl mx-auto md:py-6 md:px-4 p-0 antialiased">
      
      {/* СЕКЦИЯ 1: Тариф и Оплата */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl md:text-3xl">{t("plan.title")}</h2>
          <p className="mt-1 text-muted-foreground">{t("plan.description")}</p>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
            <BillingPlanCard />
          </div>

          {isPro && (
            <div className="rounded-3xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
              <PaymentMethodCard paymentMethod={{}} />
            </div>
          )}
        </div>
      </section>

      {/* СЕКЦИЯ 2: Кредиты */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl md:text-3xl">{t("credits.title")}</h2>
          <p className="mt-1 text-muted-foreground">{t("credits.description")}</p>
        </div>

        {creditsData ? (
          <div className="grid gap-4 md:grid-cols-5 items-stretch">
            
            {/* Левая колонка: Матовая семантическая "Банковская карта" баланса (2/5 ширины) */}
            <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/50 p-6 shadow-sm flex flex-col justify-between min-h-[240px] group transition-all hover:shadow-md">
              
              {/* Абстрактное семантическое свечение в тон основного бренда акцента */}
              <div className="absolute -right-8 -top-8 size-36 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-all group-hover:scale-110" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex size-10 items-center justify-center rounded-xl bg-muted border border-border/80 shadow-sm">
                  <CreditCard className="size-4 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <BuyCreditsDialog />
                  <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase bg-muted/80 px-2.5 py-1 rounded-full border border-border/60 backdrop-blur-sm">
                    {t("credits.balanceLabel")}
                  </span>
                </div>
              </div>

              <div className="my-auto pt-6 relative z-10">
                <p className="text-xs font-medium text-muted-foreground tracking-wide">{t("credits.totalAvailable")}</p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-foreground tabular-nums">
                    {totalCredits.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Сноска о сгорающих кредитах внизу карты */}
                <div className="border-t border-border/60 pt-4 mt-2 relative z-10">
                  <p className="text-[11px] text-muted-foreground/90 leading-normal font-normal">
                    <span className="text-primary font-medium">*</span> {t("credits.expirationNotice")}
                  </p>
              </div>
            </div>

            {/* Правая колонка: Детализация по типам (3/5 ширины) */}
            <div className="md:col-span-3 border border-border bg-card/60 backdrop-blur-xs rounded-3xl p-6 flex flex-col justify-center space-y-2 shadow-sm">
              {creditTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div key={type.labelKey} className="flex items-start gap-4 p-2.5 rounded-2xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/40">
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${type.iconClass}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/90">{t(type.labelKey)}</span>
                        <span className="text-sm font-semibold tabular-nums text-foreground">{type.value.toLocaleString()}</span>
                      </div>
                      
                      {type.progress !== null && (
                        <div className="relative w-full">
                          <Progress value={type.progress} className="mt-2.5 h-1.5 bg-muted" />
                        </div>
                      )}
                      
                      <p className="mt-1.5 text-xs text-muted-foreground/85 font-normal">
                        {type.subVars ? t(type.subKey, type.subVars) : t(type.subKey)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        ) : (
          <div className="py-12 border border-dashed border-border rounded-3xl flex items-center justify-center text-muted-foreground bg-muted/10">
            <p className="text-sm">{t("unavailable")}</p>
          </div>
        )}
      </section>

      {/* СЕКЦИЯ 3: История операций */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl md:text-3xl">{t("history.title")}</h2>
          <p className="mt-1 text-muted-foreground">{t("history.description")}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card/40 p-4 shadow-sm">
          <BillingHistory 
            view="all"
            historyLoading={historyLoading}
            historyError={historyError}
            creditHistory={creditHistory}
            invoiceHistory={invoiceHistory}
          />
        </div>
      </section>
    </div>
  )
}