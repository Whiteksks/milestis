"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

const USE_CASES = [
  {
    id: "eventStories",
    image: "/images/event-story.jpg",
  },
  {
    id: "instantPortfolios",
    image: "/images/portfolio.jpg",
  },
  {
    id: "photographerUpsell",
    image: "/images/upsell.jpg",
  },
]

export function UseCasesSection() {
  const t = useTranslations("UseCases")

  return (
    <section className="bg-secondary/50 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((useCase) => (
            <div
              key={useCase.id}
              className="group overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-lg flex flex-col"
            >
              <div className="aspect-4/3 overflow-hidden relative">
                <Image
                  src={useCase.image || "/placeholder.svg"}
                  alt={t(`cases.${useCase.id}.title`)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 flex-grow">
                <h3 className="mb-3 text-xl font-semibold">
                  {t(`cases.${useCase.id}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`cases.${useCase.id}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}