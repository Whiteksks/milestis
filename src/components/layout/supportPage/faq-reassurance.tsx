"use client"

import { useTranslations } from "next-intl"
import { Heart, Lock, Smile } from "lucide-react"

const reassurances = [
  {
    id: "memories",
    icon: Heart,
  },
  {
    id: "noPressure",
    icon: Smile,
  },
  {
    id: "control",
    icon: Lock,
  },
]

export function FaqReassurance() {
  const t = useTranslations("FaqPage")

  return (
    <section className="px-6 py-16 md:py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-2xl bg-secondary/50 px-6 py-10 md:px-12 md:py-14">
          <div className="grid gap-8 md:grid-cols-3">
            {reassurances.map((item) => (
              <div key={item.id} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-medium text-foreground">
                  {t(`reassurance.cards.${item.id}.title`)}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(`reassurance.cards.${item.id}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}