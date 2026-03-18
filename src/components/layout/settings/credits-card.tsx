import { Progress } from "@/components/ui/progress"
import { Sparkles, Gift, ShoppingBag } from "lucide-react"
import { useTranslations } from "next-intl"

interface CreditsBreakdownProps {
  monthly: { used: number; total: number; resetDate: string };
  bonus: { amount: number };
  purchased: { amount: number };
}

export function CreditsCard({ monthly, bonus, purchased }: CreditsBreakdownProps) {
  const t = useTranslations("account.billing.credits")
  const totalCredits = (monthly.total - monthly.used) + bonus.amount + purchased.amount
  const monthlyRemaining = monthly.total - monthly.used
  const monthlyPercentage = (monthly.used / monthly.total) * 100

  const types = [
    {
      icon: Sparkles,
      labelKey: "items.monthly.label",
      value: monthlyRemaining,
      subKey: "items.monthly.sub",
      subVars: { total: monthly.total, resetDate: monthly.resetDate },
      progress: monthlyPercentage,
    },
    {
      icon: Gift,
      labelKey: "items.bonus.label",
      value: bonus.amount,
      subKey: "items.bonus.sub",
      progress: null,
    },
    {
      icon: ShoppingBag,
      labelKey: "items.purchased.label",
      value: purchased.amount,
      subKey: "items.purchased.sub",
      progress: null,
    },
  ]

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      {/* Big total */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Total available</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-serif text-5xl font-bold leading-none">{totalCredits}</span>
          <span className="text-lg text-muted-foreground">credits</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-5">
        {types.map((type) => (
          <div key={type.labelKey} className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <type.icon className="size-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t(type.labelKey)}</span>
                <span className="text-sm font-semibold tabular-nums">{type.value}</span>
              </div>
              {type.progress !== null && (
                <Progress value={type.progress} className="mt-1.5 h-1.5" />
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">{type.subVars ? t(type.subKey, type.subVars) : t(type.subKey)}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">{t("usedOrder")}</p>
    </div>
  )
}
