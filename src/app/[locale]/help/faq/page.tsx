import type { Metadata } from "next"
import Header from "@/components/layout/header"
import { FaqHero } from "@/components/layout/supportPage/faq-hero"
import { FaqContent } from "@/components/layout/supportPage/faq-content"
import { FaqReassurance } from "@/components/layout/supportPage/faq-reassurance"

export const metadata: Metadata = {
  title: "FAQ — Milestis",
  description: "Everything you need to know about creating and sharing memories with Milestis.",
}

export default function FaqPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <FaqHero />
      <FaqContent />
      <FaqReassurance />
    </main>
  )
}
