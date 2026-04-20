import { Button } from "@/components/ui/button"
import { CreditCard, MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface PaymentMethodProps {
  type: string
  last4: string
  expiry: string
  brand?: "visa" | "mastercard" | "amex" | "default"
  manageHref?: string
}

export function PaymentMethodCard({
  type,
  last4,
  expiry,
  brand = "default",
  manageHref,
}: PaymentMethodProps) {
  const t = useTranslations("account.billing.payment")
  return (
    <div className="group rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent">
        <CreditCard className="h-6 w-6 text-primary" />
      </div>

      <h3 className="font-serif text-xl font-semibold">{t("title")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{brand}</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{type}</p>
            <p className="text-sm font-medium">•••• {last4}</p>
            <p className="text-xs text-muted-foreground">{t("expires", { expiry })}</p>
          </div>
        </div>
        {manageHref ? (
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
            <Link href={manageHref} aria-label={t("manage") ?? "Manage payment method"}>
              <MoreHorizontal className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
