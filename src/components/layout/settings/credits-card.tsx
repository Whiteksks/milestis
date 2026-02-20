import { Progress } from "@/components/ui/progress"
import { Sparkles, Gift, ShoppingBag } from "lucide-react"

interface CreditsBreakdownProps {
  monthly: { used: number; total: number; resetDate: string };
  bonus: { amount: number };
  purchased: { amount: number };
}

export function CreditsCard({ monthly, bonus, purchased }: CreditsBreakdownProps) {
  const totalCredits = (monthly.total - monthly.used) + bonus.amount + purchased.amount
  const monthlyRemaining = monthly.total - monthly.used
  const monthlyPercentage = (monthly.used / monthly.total) * 100

  const types = [
    {
      icon: Sparkles,
      label: "Monthly",
      value: monthlyRemaining,
      sub: `of ${monthly.total} · resets ${monthly.resetDate}`,
      progress: monthlyPercentage,
    },
    {
      icon: Gift,
      label: "Bonus",
      value: bonus.amount,
      sub: "No expiration",
      progress: null,
    },
    {
      icon: ShoppingBag,
      label: "Purchased",
      value: purchased.amount,
      sub: "Valid forever",
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
          <div key={type.label} className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <type.icon className="size-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{type.label}</span>
                <span className="text-sm font-semibold tabular-nums">{type.value}</span>
              </div>
              {type.progress !== null && (
                <Progress value={type.progress} className="mt-1.5 h-1.5" />
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">{type.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Used in order: Bonus → Monthly → Purchased
      </p>
    </div>
  )
}
