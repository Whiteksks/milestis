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
      <div className="mx-auto max-w-5xl space-y-8 pb-12">
        <section className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-xs" />
            <Skeleton className="h-4 w-72 rounded-xs" />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Skeleton className="h-48 rounded-xs lg:col-span-2" />
            <Skeleton className="h-48 rounded-xs" />
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
      iconClass: "text-foreground bg-secondary/50 border-border",
    },
    {
      icon: Gift,
      labelKey: "credits.items.bonus.label",
      value: creditsData.bonus.amount,
      subKey: "credits.items.bonus.sub",
      progress: null,
      iconClass: "text-foreground bg-secondary/50 border-border",
    },
    {
      icon: ShoppingBag,
      labelKey: "credits.items.purchased.label",
      value: creditsData.purchased.amount,
      subKey: "credits.items.purchased.sub",
      progress: null,
      iconClass: "text-foreground bg-secondary/50 border-border",
    },
  ] : []

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-12">
      
      {/* СЕКЦИЯ 1: Тариф и Оплата */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t("plan.title")}
          </h2>
          <span className="h-px flex-1 bg-border/80" />
        </div>
        <p className="font-sans text-sm text-muted-foreground">{t("plan.description")}</p>

        <div className="space-y-4">
          <div className="rounded-xs border border-border bg-card p-5 md:p-6">
            <BillingPlanCard />
          </div>

          {isPro && (
            <div className="rounded-xs border border-border bg-card p-5 md:p-6">
              <PaymentMethodCard paymentMethod={{}} />
            </div>
          )}
        </div>
      </section>

      {/* СЕКЦИЯ 2: Кредиты */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t("credits.title")}
          </h2>
          <span className="h-px flex-1 bg-border/80" />
        </div>
        <p className="font-sans text-sm text-muted-foreground">{t("credits.description")}</p>

        {creditsData ? (
          <div className="grid gap-4 md:grid-cols-5 items-stretch">
            
            {/* Левая колонка: Баланс и Кнопка покупки (2/5 ширины) */}
            <div className="md:col-span-2 flex flex-col gap-4">
              
              <div className="rounded-xs border border-border bg-card p-5 md:p-6 flex flex-col justify-between min-h-[220px] flex-1">
                
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-xs border border-border bg-secondary/50">
                    <CreditCard className="size-4 text-foreground" />
                  </div>
                  <span className="font-sans text-[10px] font-medium tracking-wider text-muted-foreground uppercase bg-secondary/50 px-2 py-0.5 rounded-xs border border-border">
                    {t("credits.balanceLabel")}
                  </span>
                </div>

                <div className="my-auto pt-4">
                  <p className="font-sans text-xs text-muted-foreground">{t("credits.totalAvailable")}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-4xl font-semibold tracking-tight text-foreground tabular-nums">
                      {totalCredits.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border/80 pt-3 mt-2">
                  <p className="font-sans text-xs text-muted-foreground leading-normal">
                    <span className="text-foreground font-medium">*</span> {t("credits.expirationNotice")}
                  </p>
                </div>
              </div>

              <div className="[&>button]:w-full [&>button]:h-9 [&>button]:rounded-xs [&>button]:bg-foreground [&>button]:text-background [&>button]:font-sans [&>button]:text-xs [&>button]:font-medium [&>button]:hover:bg-foreground/90">
                <BuyCreditsDialog />
              </div>
            </div>

            {/* Правая колонка: Детализация по типам (3/5 ширины) */}
            <div className="md:col-span-3 rounded-xs border border-border bg-card p-5 md:p-6 flex flex-col justify-center space-y-3">
              {creditTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div key={type.labelKey} className="flex items-start gap-3.5 p-3 rounded-xs border border-border bg-background/50">
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-xs border ${type.iconClass}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-sm font-medium text-foreground">{t(type.labelKey)}</span>
                        <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{type.value.toLocaleString()}</span>
                      </div>
                      
                      {type.progress !== null && (
                        <div className="relative w-full">
                          <Progress value={type.progress} className="mt-2 h-1 bg-secondary rounded-none" />
                        </div>
                      )}
                      
                      <p className="mt-1.5 font-sans text-xs text-muted-foreground">
                        {type.subVars ? t(type.subKey, type.subVars) : t(type.subKey)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        ) : (
          <div className="py-12 border border-dashed border-border rounded-xs flex items-center justify-center text-muted-foreground bg-card/50">
            <p className="font-sans text-sm">{t("unavailable")}</p>
          </div>
        )}
      </section>

      {/* СЕКЦИЯ 3: История операций */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t("history.title")}
          </h2>
          <span className="h-px flex-1 bg-border/80" />
        </div>
        <p className="font-sans text-sm text-muted-foreground">{t("history.description")}</p>

        <div className="rounded-xs border border-border bg-card p-5 md:p-6">
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