"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, History } from "lucide-react"
import { cn } from "@/lib/utils"
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

function getCreditLabel(t: ReturnType<typeof useTranslations>, type: string, direction: "in" | "out", meta?: Record<string, unknown>) {
  if (type === "admin_adjustment" && direction === "in" && meta?.reason === "support_compensation") return t("types.compensation")
  if (type === "spend" && meta?.reason === "menu_monthly") return t("types.menuMonthly")
  if (type === "spend" && meta?.reason === "menu_upgrade") return t("types.menuUpgrade")
  switch (type) {
    case "grant": return t("types.creditGrant")
    case "spend": return t("types.creditSpend")
    case "expire": return t("types.creditExpire")
    case "admin_adjustment":
      return direction === "in" ? t("types.creditAdjustmentIn") : t("types.creditAdjustmentOut")
    default: return t("types.credit")
  }
}

function getInvoiceLabel(t: ReturnType<typeof useTranslations>, type: string) {
  switch (type) {
    case "buy_credits": return t("types.buyCredits")
    case "subscription_payment": return t("types.subscriptionPayment")
    case "refund": return t("types.refund")
    default: return t("types.invoice")
  }
}

function getCreditProjectName(meta: Record<string, unknown> | undefined) {
  return (typeof meta?.projectName === "string" && meta.projectName.trim()) ||
    (typeof meta?.projectTitle === "string" && meta.projectTitle.trim()) || null
}

function clampPage(page: number, totalItems: number) {
  const totalPages = Math.max(1, Math.ceil(totalItems / HISTORY_PAGE_SIZE))
  return Math.min(page, totalPages)
}

// Новые интерфейсы для типизации элементов истории
interface CreditHistoryItem {
  id: string
  type: string
  direction: "in" | "out"
  createdAt: Date | number
  amount: number
  balanceSnapshot: {
    total: number
  }
  meta?: Record<string, unknown>
}

interface InvoiceHistoryItem {
  id: string
  type: string
  direction: "in" | "out"
  createdAt: Date | number
  amountMinor: number
  currency: string
  meta?: Record<string, unknown>
}

interface BillingHistoryProps {
  view?: "all" | "credits" | "invoices"
  historyLoading: boolean
  historyError: Error | unknown // Заменили any на unknown (безопасный тип для ошибок)
  creditHistory: CreditHistoryItem[]
  invoiceHistory: InvoiceHistoryItem[]
}

export function BillingHistory({
  view = "all",
  historyLoading,
  historyError,
  creditHistory = [],
  invoiceHistory = [],
}: BillingHistoryProps) {
  const t = useTranslations("billing")
  const locale = useLocale()
  
  const [activeTab, setActiveTab] = useState<"credits" | "billing">(
    view === "invoices" ? "billing" : "credits"
  )
  const [creditPage, setCreditPage] = useState(1)
  const [invoicePage, setInvoicePage] = useState(1)

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  useEffect(() => {
    setCreditPage((currentPage) => clampPage(currentPage, creditHistory.length))
  }, [creditHistory.length])

  useEffect(() => {
    setInvoicePage((currentPage) => clampPage(currentPage, invoiceHistory.length))
  }, [invoiceHistory.length])

  if (historyLoading) return <HistorySkeleton />
  if (historyError) return <EmptyHistoryState message={t("unavailable")} />

  const renderCredits = () => {
    const creditTotalPages = Math.max(1, Math.ceil(creditHistory.length / HISTORY_PAGE_SIZE))
    const visibleCreditHistory = creditHistory.slice(
      (creditPage - 1) * HISTORY_PAGE_SIZE,
      creditPage * HISTORY_PAGE_SIZE
    )

    if (creditHistory.length === 0) return <EmptyHistoryState message={t("noCredits")} />

    return (
      <div className="space-y-6">
        <div className="divide-y divide-border/40 border-b border-border/40 px-1">
          {visibleCreditHistory.map((item) => {
            const projectName = getCreditProjectName(item.meta)
            const isIn = item.direction === "in"
            return (
              <div key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/20 transition-colors rounded-xl px-3 -mx-3">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm text-foreground/90">{getCreditLabel(t, item.type, item.direction, item.meta)}</span>
                    <Badge variant={isIn ? "secondary" : "outline"} className="rounded-full text-[11px] font-normal px-2 py-0">
                      {isIn ? t("direction.in") : t("direction.out")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dateFormatter.format(item.createdAt)}
                    {projectName && ` · ${t("project", { name: projectName })}`}
                  </p>
                </div>
                <div className="text-left sm:text-right space-y-0.5">
                  <p className={cn("font-semibold text-sm tabular-nums tracking-tight", isIn ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>
                    {isIn ? "+" : "-"}{item.amount} {t("creditsLabel")}
                  </p>
                  <p className="text-[11px] text-muted-foreground/80">
                    {t("balanceAfter", { total: item.balanceSnapshot.total })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        {creditTotalPages > 1 && (
          <Pagination currentPage={creditPage} totalPages={creditTotalPages} onPageChange={setCreditPage} t={t} />
        )}
      </div>
    )
  }

  const renderInvoices = () => {
    const invoiceTotalPages = Math.max(1, Math.ceil(invoiceHistory.length / HISTORY_PAGE_SIZE))
    const visibleInvoiceHistory = invoiceHistory.slice(
      (invoicePage - 1) * HISTORY_PAGE_SIZE,
      invoicePage * HISTORY_PAGE_SIZE
    )

    if (invoiceHistory.length === 0) return <EmptyHistoryState message={t("noInvoices")} />

    return (
      <div className="space-y-6">
        <div className="divide-y divide-border/40 border-b border-border/40 px-1">
          {visibleInvoiceHistory.map((item) => {
            // direction: "in"  = money received by service = user was charged
            // direction: "out" = money returned to user    = refund
            const isCharge = item.direction === "in"
            return (
              <div key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/20 transition-colors rounded-xl px-3 -mx-3">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm text-foreground/90">{getInvoiceLabel(t, item.type)}</span>
                    <Badge variant="outline" className="rounded-full text-[11px] font-normal px-2 py-0">
                      {isCharge ? t("direction.charge") : t("direction.refund")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dateFormatter.format(item.createdAt)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className={cn("font-semibold text-sm tabular-nums tracking-tight", !isCharge ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>
                    {isCharge ? "-" : "+"}{formatCurrency(locale, item.amountMinor, item.currency)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        {invoiceTotalPages > 1 && (
          <Pagination currentPage={invoicePage} totalPages={invoiceTotalPages} onPageChange={setInvoicePage} t={t} />
        )}
      </div>
    )
  }

  if (view === "credits") return renderCredits()
  if (view === "invoices") return renderInvoices()

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "credits" | "billing")} className="w-full">
      <TabsList className="inline-flex h-10 items-center justify-center rounded-full bg-muted/60 p-1 text-muted-foreground backdrop-blur-sm">
        <TabsTrigger value="credits" className="rounded-full px-6 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
          {t("tabs.credits")}
        </TabsTrigger>
        <TabsTrigger value="billing" className="rounded-full px-6 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
          {t("tabs.invoices")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="credits" className="mt-6 focus-visible:outline-none">
        {renderCredits()}
      </TabsContent>

      <TabsContent value="billing" className="mt-6 focus-visible:outline-none">
        {renderInvoices()}
      </TabsContent>
    </Tabs>
  )
}

function HistorySkeleton() {
  return (
    <div className="space-y-4 py-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between py-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
      ))}
    </div>
  )
}

function EmptyHistoryState({ message }: { message: string }) {
  return (
    <div className="py-16 text-center border border-dashed rounded-3xl bg-muted/10 flex flex-col items-center justify-center gap-2 text-muted-foreground/70">
      <History className="size-5 stroke-[1.5] text-muted-foreground/40" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: React.Dispatch<React.SetStateAction<number>>
  t: ReturnType<typeof useTranslations>
}

// Заменили аny на структурированный интерфейс PaginationProps
function Pagination({ currentPage, totalPages, onPageChange, t }: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <Button
        variant="ghost" size="sm" className="rounded-full text-xs text-muted-foreground hover:text-foreground"
        onClick={() => onPageChange((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
      >
        <ChevronLeft className="size-3.5 mr-1" />
        {t("pagination.previous")}
      </Button>
      <p className="text-xs tabular-nums text-muted-foreground/80">
        {t("pagination.page", { current: currentPage, total: totalPages })}
      </p>
      <Button
        variant="ghost" size="sm" className="rounded-full text-xs text-muted-foreground hover:text-foreground"
        onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
      >
        {t("pagination.next")}
        <ChevronRight className="size-3.5 ml-1" />
      </Button>
    </div>
  )
}
