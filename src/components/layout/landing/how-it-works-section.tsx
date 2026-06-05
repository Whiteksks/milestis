"use client"

import { LayoutTemplate, ImagePlus, Sparkles, Share2 } from "lucide-react"
import { useTranslations } from "next-intl"

const STEPS = [
  {
    id: "pickTemplate",
    icon: LayoutTemplate,
  },
  {
    id: "addContent",
    icon: ImagePlus,
  },
  {
    id: "personalTouch",
    icon: Sparkles,
  },
  {
    id: "publishShare",
    icon: Share2,
  },
]

export function HowItWorksSection() {
  const t = useTranslations("HowItWorks")

  return (
    <section className="bg-card px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="relative text-center">
              {/* Step number */}
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <step.icon className="h-7 w-7 text-primary" />
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="absolute left-[calc(50%+2.5rem)] top-8 hidden h-px w-[calc(100%-3rem)] bg-border lg:block" />
              )}

              <h3 className="mb-2 text-lg font-semibold">
                {t(`steps.${step.id}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`steps.${step.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}