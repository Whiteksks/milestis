"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditsCard } from "@/components/layout/settings/credits-card"
import { BillingPlanCard } from "@/components/layout/settings/billing-plan-card"
import { PaymentMethodCard } from "@/components/layout/settings/payment-method-card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useBilling } from "@/hooks/useBilling"
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"

function formatCurrency(locale: string, amountMinor: number, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100)
}

function getCreditLabel(t: ReturnType<typeof useTranslations>, type: string, direction: "in" | "out") {
  switch (type) {
    case "grant":
      return t("history.types.creditGrant")
    case "spend":
      return t("history.types.creditSpend")
    case "expire":
      return t("history.types.creditExpire")
    case "admin_adjustment":
      return direction === "in"
        ? t("history.types.creditAdjustmentIn")
        : t("history.types.creditAdjustmentOut")
    default:
      return t("history.types.credit")
  }
}

function getInvoiceLabel(t: ReturnType<typeof useTranslations>, type: string) {
  switch (type) {
    case "buy_credits":
      return t("history.types.buyCredits")
    case "subscription_payment":
      return t("history.types.subscriptionPayment")
    case "refund":
      return t("history.types.refund")
    default:
      return t("history.types.invoice")
  }
}

export default function BillingSettings() {
  const t = useTranslations("account.billing")
  const locale = useLocale()
  const {
    loading,
    creditsData,
    planName,
    planDesc,
    isPro,
    creditHistory,
    invoiceHistory,
    paymentMethod,
  } = useBilling()

  const pricingHref = `/${locale}/pricing`
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  if (loading) {
    return (
      <div className="space-y-12">
        <section className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </section>
        <section className="space-y-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-56 rounded-2xl" />
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-12">

      {/* Plan + Payment */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">{t("plan.title")}</h2>
          <p className="mt-1 text-muted-foreground">{t("plan.description")}</p>
        </div>
        <div className={cn("grid gap-4", paymentMethod && "lg:grid-cols-2")}>
          <BillingPlanCard
            planName={planName}
            planDescription={planDesc}
            isPro={isPro}
            upgradeHref={pricingHref}
            manageHref={pricingHref}
            compareHref={`${pricingHref}#plans`}
          />
          {paymentMethod ? (
            <PaymentMethodCard
              type={paymentMethod.type || t("payment.type.creditCard")}
              last4={paymentMethod.last4}
              expiry={paymentMethod.expiry}
              brand={paymentMethod.brand}
              manageHref={pricingHref}
            />
          ) : null}
        </div>
      </section>

      {/* Credits */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">{t("credits.title")}</h2>
          <p className="mt-1 text-muted-foreground">{t("credits.description")}</p>
        </div>
        {creditsData ? (
          <CreditsCard
            monthly={creditsData.monthly}
            bonus={creditsData.bonus}
            purchased={creditsData.purchased}
          />
        ) : (
          <p className="py-8 text-center text-muted-foreground">{t("credits.unavailable")}</p>
        )}
      </section>

      {/* History */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">{t("history.title")}</h2>
          <p className="mt-1 text-muted-foreground">{t("history.description")}</p>
        </div>

        <Tabs defaultValue="credits" className="w-full">
            <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="credits" className="rounded-full px-6 text-sm">{t("tabs.credits")}</TabsTrigger>
            <TabsTrigger value="billing" className="rounded-full px-6 text-sm">{t("tabs.invoices")}</TabsTrigger>
          </TabsList>

          <TabsContent value="credits" className="mt-6">
            {creditHistory.length > 0 ? (
              <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
                {creditHistory.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
                      index > 0 && "border-t border-border"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{getCreditLabel(t, item.type, item.direction)}</p>
                        <Badge variant="secondary" className="rounded-full">
                          {item.direction === "in" ? t("history.direction.in") : t("history.direction.out")}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {dateFormatter.format(item.createdAt)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold tabular-nums">
                        {item.direction === "out" ? "-" : "+"}{item.amount} {t("credits.creditsLabel")}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("history.balanceAfter", { total: item.balanceSnapshot.total })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">{t("history.noCredits")}</p>
            )}
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            {invoiceHistory.length > 0 ? (
              <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
                {invoiceHistory.map((item, index) => {
                  const reference = typeof item.meta?.paddleTransactionId === "string"
                    ? item.meta.paddleTransactionId
                    : null

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
                        index > 0 && "border-t border-border"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{getInvoiceLabel(t, item.type)}</p>
                          <Badge variant="outline" className="rounded-full">
                            {item.direction === "in" ? t("history.direction.refund") : t("history.direction.charge")}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {dateFormatter.format(item.createdAt)}
                          {reference ? ` · ${t("history.reference", { id: reference })}` : ""}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-semibold tabular-nums">
                          {item.direction === "in" ? "+" : "-"}
                          {formatCurrency(locale, item.amountMinor, item.currency)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">{t("history.noInvoices")}</p>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
