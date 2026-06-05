"use client"

import { ShieldCheck, Layers, MousePointer2, Palette, Sparkles, Link2 } from "lucide-react"
import { useTranslations } from "next-intl"

const FEATURES = [
  {
    id: "unbreakableDesign",
    icon: ShieldCheck,
  },
  {
    id: "depthAtmosphere",
    icon: Layers,
  },
  {
    id: "freeformDecorations",
    icon: MousePointer2,
  },
  {
    id: "colorPalettes",
    icon: Palette,
  },
  {
    id: "interactiveAnimations",
    icon: Sparkles,
  },
  {
    id: "shareableLink",
    icon: Link2,
  },
]

export function FeaturesSection() {
  const t = useTranslations("Features")

  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.id} className="group rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {t(`items.${feature.id}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`items.${feature.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}