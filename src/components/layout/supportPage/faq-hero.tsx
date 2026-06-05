"use client"

import { useTranslations } from "next-intl"

export function FaqHero() {
  const t = useTranslations("FaqPage")

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-3xl text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          {t("hero.description")}
        </p>
      </div>
    </section>
  )
}