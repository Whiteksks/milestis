"use client"

import { Briefcase, Sparkles, Link2 } from "lucide-react"
import { useTranslations } from "next-intl"

const CONTEXTS = [
  {
    id: "eventStories",
    icon: Sparkles,
  },
  {
    id: "clientGifts",
    icon: Briefcase,
  },
  {
    id: "shareableLinks",
    icon: Link2,
  },
]

export function EmotionalContextSection() {
  const t = useTranslations("EmotionalContext")

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <p className="mb-10 text-center text-lg text-muted-foreground">
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {CONTEXTS.map((context) => (
            <div
              key={context.id}
              className="flex items-center gap-3 rounded-full bg-card px-6 py-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <context.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium md:text-base">
                {t(`labels.${context.id}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}