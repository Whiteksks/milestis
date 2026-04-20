"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditsCard } from "@/components/layout/settings/credits-card"
import { BillingPlanCard } from "@/components/layout/settings/billing-plan-card"
import { PaymentMethodCard } from "@/components/layout/settings/payment-method-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useBilling } from "@/hooks/useBilling"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

const HISTORY_PAGE_SIZE = 5

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

function getCreditProjectName(meta: Record<string, unknown> | undefined) {
  if (typeof meta?.projectName === "string" && meta.projectName.trim()) {
    return meta.projectName.trim()
  }

  if (typeof meta?.projectTitle === "string" && meta.projectTitle.trim()) {
    return meta.projectTitle.trim()
  }

  return null
}

function clampPage(page: number, totalItems: number) {
  const totalPages = Math.max(1, Math.ceil(totalItems / HISTORY_PAGE_SIZE))
  return Math.min(page, totalPages)
}

export default function BillingSettings() {
  const t = useTranslations("account.billing")
  const locale = useLocale()
  const [activeTab, setActiveTab] = useState<"credits" | "billing">("credits")
  const [creditPage, setCreditPage] = useState(1)
  const [invoicePage, setInvoicePage] = useState(1)
  const {
    loading,
    historyLoading,
    historyError,
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
  const creditTotalPages = Math.max(1, Math.ceil(creditHistory.length / HISTORY_PAGE_SIZE))
  const invoiceTotalPages = Math.max(1, Math.ceil(invoiceHistory.length / HISTORY_PAGE_SIZE))
  const visibleCreditHistory = creditHistory.slice(
    (creditPage - 1) * HISTORY_PAGE_SIZE,
    creditPage * HISTORY_PAGE_SIZE,
  )
  const visibleInvoiceHistory = invoiceHistory.slice(
    (invoicePage - 1) * HISTORY_PAGE_SIZE,
    invoicePage * HISTORY_PAGE_SIZE,
  )

  useEffect(() => {
    setCreditPage((currentPage) => clampPage(currentPage, creditHistory.length))
  }, [creditHistory.length])

  useEffect(() => {
    setInvoicePage((currentPage) => clampPage(currentPage, invoiceHistory.length))
  }, [invoiceHistory.length])

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

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "credits" | "billing")} className="w-full">
            <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="credits" className="rounded-full px-6 text-sm">{t("tabs.credits")}</TabsTrigger>
            <TabsTrigger value="billing" className="rounded-full px-6 text-sm">{t("tabs.invoices")}</TabsTrigger>
          </TabsList>

          <TabsContent value="credits" className="mt-6">
              {historyLoading ? (
                <div className="rounded-2xl bg-card p-4 shadow-sm">
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Skeleton key={item} className="h-16 rounded-xl" />
                    ))}
                  </div>
                </div>
              ) : historyError ? (
                <p className="py-8 text-center text-muted-foreground">{t("history.unavailable")}</p>
              ) : creditHistory.length > 0 ? (
              <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
                {visibleCreditHistory.map((item, index) => (
                  (() => {
                    const projectName = getCreditProjectName(item.meta)

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
                        <p className="font-medium">{getCreditLabel(t, item.type, item.direction)}</p>
                        <Badge variant="secondary" className="rounded-full">
                          {item.direction === "in" ? t("history.direction.in") : t("history.direction.out")}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {dateFormatter.format(item.createdAt)}
                      </p>
                      {projectName ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t("history.project", { name: projectName })}
                        </p>
                      ) : null}
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
                    )
                  })()
                ))}
              </div>
              {creditTotalPages > 1 ? (
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setCreditPage((page) => Math.max(1, page - 1))}
                    disabled={creditPage === 1}
                  >
                    <ChevronLeft className="size-4" />
                    {t("history.pagination.previous")}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {t("history.pagination.page", { current: creditPage, total: creditTotalPages })}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setCreditPage((page) => Math.min(creditTotalPages, page + 1))}
                    disabled={creditPage === creditTotalPages}
                  >
                    {t("history.pagination.next")}
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              ) : null}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">{t("history.noCredits")}</p>
            )}
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            {historyLoading ? (
              <div className="rounded-2xl bg-card p-4 shadow-sm">
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Skeleton key={item} className="h-16 rounded-xl" />
                  ))}
                </div>
              </div>
            ) : historyError ? (
              <p className="py-8 text-center text-muted-foreground">{t("history.unavailable")}</p>
            ) : invoiceHistory.length > 0 ? (
              <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
                {visibleInvoiceHistory.map((item, index) => {
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
              {invoiceTotalPages > 1 ? (
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setInvoicePage((page) => Math.max(1, page - 1))}
                    disabled={invoicePage === 1}
                  >
                    <ChevronLeft className="size-4" />
                    {t("history.pagination.previous")}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {t("history.pagination.page", { current: invoicePage, total: invoiceTotalPages })}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setInvoicePage((page) => Math.min(invoiceTotalPages, page + 1))}
                    disabled={invoicePage === invoiceTotalPages}
                  >
                    {t("history.pagination.next")}
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              ) : null}
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
