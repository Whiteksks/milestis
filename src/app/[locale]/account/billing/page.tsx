"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, BookOpen, Download, Receipt } from "lucide-react"
import { CreditsCard } from "@/components/layout/settings/credits-card"
import { BillingPlanCard } from "@/components/layout/settings/billing-plan-card"
import { PaymentMethodCard } from "@/components/layout/settings/payment-method-card"

export default function BillingSettings() {
  const creditsData = {
    monthly: { used: 7, total: 10, resetDate: "Jan 1" },
    bonus: { amount: 5 },
    purchased: { amount: 12 },
  }

  const usageHistory = [
    { project: "Summer Memories 2024", credits: 2, date: "Dec 15, 2024" },
    { project: "Family Reunion Book", credits: 3, date: "Dec 8, 2024" },
    { project: "Travel Adventures", credits: 2, date: "Nov 28, 2024" },
  ]

  const billingHistory = [
    { date: "Dec 1, 2024", amount: "$0.00", status: "Free Plan" },
    { date: "Nov 1, 2024", amount: "$0.00", status: "Free Plan" },
    { date: "Oct 1, 2024", amount: "$0.00", status: "Free Plan" },
  ]

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
            planName="Free Plan"
            planDescription="Perfect for trying out Milestis. Create beautiful memory books and share them with anyone."
            isPro={false}
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
        <CreditsCard
          monthly={creditsData.monthly}
          bonus={creditsData.bonus}
          purchased={creditsData.purchased}
        />
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
            {usageHistory.length > 0 ? (
              <div className="divide-y divide-border/40">
                {usageHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
                        <BookOpen className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.project}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {item.credits} credits
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">No credit usage history yet.</p>
            )}
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            {billingHistory.length > 0 ? (
              <div className="divide-y divide-border/40">
                {billingHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
                        <Receipt className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Invoice {item.amount}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden text-xs text-muted-foreground sm:inline">{item.status}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Download className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">No billing history available.</p>
            )}
          </TabsContent>
        </Tabs>
      </section>

    </div>
  )
}
