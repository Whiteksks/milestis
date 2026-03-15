"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Receipt } from "lucide-react"
import { CreditsCard } from "@/components/layout/settings/credits-card"
import { BillingPlanCard } from "@/components/layout/settings/billing-plan-card"
import { PaymentMethodCard } from "@/components/layout/settings/payment-method-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useBilling } from "@/hooks/useBilling"

export default function BillingSettings() {
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
          <h2 className="font-serif text-2xl md:text-3xl">Your plan</h2>
          <p className="mt-1 text-muted-foreground">Manage your subscription and payment method</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <BillingPlanCard
            planName={planName}
            planDescription={planDesc}
            isPro={isPro}
          />
          <PaymentMethodCard
            type="Credit Card"
            last4="4242"
            expiry="12/26"
            brand="visa"
          />
        </div>
      </section>

      {/* Credits */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Credits</h2>
          <p className="mt-1 text-muted-foreground">Credits are used each time you publish a memory book</p>
        </div>
        {creditsData ? (
          <CreditsCard
            monthly={creditsData.monthly}
            bonus={creditsData.bonus}
            purchased={creditsData.purchased}
          />
        ) : (
          <p className="py-8 text-center text-muted-foreground">Credits information unavailable.</p>
        )}
      </section>

      {/* History */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">History</h2>
          <p className="mt-1 text-muted-foreground">Your recent credit usage and invoices</p>
        </div>

        <Tabs defaultValue="credits" className="w-full">
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="credits" className="rounded-full px-6 text-sm">Credits Usage</TabsTrigger>
            <TabsTrigger value="billing" className="rounded-full px-6 text-sm">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="credits" className="mt-6">
            <p className="py-8 text-center text-muted-foreground">No credit usage history yet.</p>
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <p className="py-8 text-center text-muted-foreground">No billing history available.</p>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
