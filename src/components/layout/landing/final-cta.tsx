"use client"

import { CTAButton } from "@/components/shared/cta-button"
import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

export function FinalCTA() {
  const t = useTranslations("FinalCTA")

  return (
    <section className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">
          {t("title")}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          {t("subtitle")}
        </p>
        <div className="mt-10">
          <CTAButton size="lg" className="gap-2 rounded-full px-10 py-6 text-lg">
            <Sparkles className="h-5 w-5" />
            {t("cta")}
          </CTAButton>
        </div>
      </div>
    </section>
  )
}