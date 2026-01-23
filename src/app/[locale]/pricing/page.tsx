import type { Metadata } from "next"
import Header from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PricingHero } from "@/components/layout/pricing/pricing-hero"
import { PricingCards } from "@/components/layout/pricing/pricing-cards"
import { PricingReassurance } from "@/components/layout/pricing/pricing-reassurance"

export const metadata: Metadata = {
  title: "Pricing — Milestis",
  description: "Simple, calm pricing for meaningful memories. Start for free and upgrade only when you need more.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-14">
      <Header />
      <PricingHero />
      <PricingCards />
      <PricingReassurance />
      <Footer />
    </main>
  )
}
