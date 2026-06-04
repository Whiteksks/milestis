"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, ShieldCheck, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface BillingPlanCardProps {
  planName?: string
  planDescription?: string
  isPro?: boolean
  upgradeHref: string
  manageHref: string
  compareHref: string
}

export function BillingPlanCard({
  planName,
  planDescription,
  isPro = false,
  upgradeHref,
  manageHref,
  compareHref,
}: BillingPlanCardProps) {
  const t = useTranslations("billing")

  const displayPlanName = planName || t("plans.free.name")
  const displayPlanDescription = planDescription || t("plans.free.desc")

  return (
    <div className={cn(
      "group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 transition-all duration-300",
      isPro && "bg-gradient-to-r from-card via-card to-primary/[0.02]"
    )}>
      {/* Левая часть: Иконка + Текст */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 shadow-xs mt-0.5",
          isPro 
            ? "text-primary bg-primary/10 border-primary/20 group-hover:bg-primary/15" 
            : "text-muted-foreground bg-muted border-border group-hover:bg-muted/80"
        )}>
          {isPro ? (
            <Sparkles className="size-4.5 transition-transform duration-500 group-hover:rotate-12" />
          ) : (
            <ShieldCheck className="size-4.5" />
          )}
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {displayPlanName}
            </h3>
            {isPro && (
              <span className="text-[10px] font-medium tracking-wide text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                {t("planCard.activeBadge")}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground/90 max-w-2xl font-normal line-clamp-2 md:line-clamp-1">
            {displayPlanDescription}
          </p>
        </div>
      </div>

      {/* Правая часть: Действия */}
      <div className="flex items-center gap-2 shrink-0 border-t border-border/40 pt-4 md:pt-0 md:border-0 justify-end">
        <Button asChild variant="ghost" size="sm" className="rounded-full px-4 text-muted-foreground hover:text-foreground group/link">
          <Link href={compareHref} className="gap-1">
            {t("planCard.viewPlans")}
            <ArrowRight className="size-3 text-muted-foreground/70 transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </Link>
        </Button>

        {!isPro ? (
          <Button asChild className="rounded-full gap-1.5 px-5 shadow-sm group/btn" size="sm">
            <Link href={upgradeHref}>
              <Sparkles className="size-3" />
              {t("planCard.upgrade")}
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="rounded-full px-5 bg-background/50" size="sm">
            <Link href={manageHref}>
              {t("planCard.manage")}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}