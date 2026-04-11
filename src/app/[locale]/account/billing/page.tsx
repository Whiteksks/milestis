"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditsCard } from "@/components/layout/settings/credits-card"
import { BillingPlanCard } from "@/components/layout/settings/billing-plan-card"
import { PaymentMethodCard } from "@/components/layout/settings/payment-method-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useBilling } from "@/hooks/useBilling"
import { useTranslations } from "next-intl"

export default function BillingSettings() {
  const t = useTranslations("account.billing")
  const { loading, creditsData, planName, planDesc, isPro } = useBilling()

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
        <div className="grid gap-4 lg:grid-cols-2">
          <BillingPlanCard
            planName={planName}
            planDescription={planDesc}
            isPro={isPro}
          />
          <PaymentMethodCard
            type={t("payment.type.creditCard")}
            last4="4242"
            expiry="12/26"
            brand="visa"
          />
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
            <p className="py-8 text-center text-muted-foreground">{t("history.noCredits")}</p>
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <p className="py-8 text-center text-muted-foreground">{t("history.noInvoices")}</p>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
