import { Button } from "@/components/ui/button"
import { Sparkles, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface BillingPlanCardProps {
  planName: string
  planDescription: string
  isPro?: boolean
  upgradeHref: string
  manageHref: string
  compareHref: string
}

export function BillingPlanCard({
  planName = "Free Plan",
  planDescription = "Perfect for trying out Milestis. Create beautiful photo books and share your memories.",
  isPro = false,
  upgradeHref,
  manageHref,
  compareHref,
}: BillingPlanCardProps) {
  const t = useTranslations("account.billing.plan")
  return (
    <div className={cn(
      "group rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md",
      isPro && "bg-primary/5"
    )}>
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent">
        {isPro
          ? <Sparkles className="h-6 w-6 text-primary" />
          : <ShieldCheck className="h-6 w-6 text-primary" />
        }
      </div>

      <h3 className="font-serif text-xl font-semibold">{planName}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{planDescription}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {!isPro ? (
          <Button asChild className="rounded-full gap-2 px-6" size="sm">
            <Link href={upgradeHref}>
              <Sparkles className="size-3.5" />
              {t("upgrade")}
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="rounded-full px-6" size="sm">
            <Link href={manageHref}>{t("manage")}</Link>
          </Button>
        )}
        <Button asChild variant="ghost" size="sm" className="rounded-full px-6 text-muted-foreground hover:text-foreground">
          <Link href={compareHref}>{t("compare")}</Link>
        </Button>
      </div>
    </div>
  )
}
