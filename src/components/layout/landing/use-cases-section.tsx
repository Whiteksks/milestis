"use client"

import { useTranslations } from "next-intl"
import { EventStoriesIcon } from "@/components/assets/use-case1"
import { InstantPortfoliosIcon } from "@/components/assets/use-case2"
import { PhotographerUpsellIcon } from "@/components/assets/use-case3"

interface UseCase {
  id: string
  Icon: React.ComponentType<{ className?: string }>
}

const USE_CASES: UseCase[] = [
  {
    id: "eventStories",
    Icon: EventStoriesIcon,
  },
  {
    id: "instantPortfolios",
    Icon: InstantPortfoliosIcon,
  },
  {
    id: "photographerUpsell",
    Icon: PhotographerUpsellIcon,
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
          {USE_CASES.map((useCase) => {
            // Деструктурируем иконку с большой буквы, чтобы валидно использовать её как тег
            const { Icon, id } = useCase

            return (
              <div
                key={id}
                className="group overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-lg flex flex-col"
              >
                <div className="aspect-4/3 flex items-center justify-center bg-muted/30 p-8 relative overflow-hidden">
                  <Icon 
                    className="h-auto scale-170 w-full max-w-[340px] text-black dark:text-white" 
                  />
                </div>

                <div className="p-8 flex-grow">
                  <h3 className="mb-3 text-xl font-semibold">
                    {t(`cases.${id}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`cases.${id}.description`)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}