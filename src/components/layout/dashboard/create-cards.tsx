"use client"

import { ArrowRight, Loader2 } from "lucide-react"
import { useCreateProject } from "@/hooks/useCreateProject"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { ProjectMode } from "@/lib/projects/project-type-config"

const cards: {
  mode: ProjectMode
  number: string
  titleKey: string
  descriptionKey: string
}[] = [
  {
    mode: "photobook",
    number: "01",
    titleKey: "createCards.photobook.title",
    descriptionKey: "createCards.photobook.description",
  },
  {
    mode: "portfolio",
    number: "02",
    titleKey: "createCards.portfolio.title",
    descriptionKey: "createCards.portfolio.description",
  },
  {
    mode: "event",
    number: "03",
    titleKey: "createCards.event.title",
    descriptionKey: "createCards.event.description",
  },
]

export function CreateCards() {
  const { handleCreate, loadingMode } = useCreateProject()
  const t = useTranslations()

  return (
    // Идеальная линия из 3 колонок на больших экранах, аккуратный стек на мобилках
    <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const isLoading = loadingMode === card.mode
        const isDisabled = !!loadingMode 

        return (
          <button
            key={card.mode}
            onClick={() => handleCreate(card.mode)}
            disabled={isDisabled}
            className={cn(
              "group relative flex flex-col justify-between text-left transition-all duration-500 ease-out",
              "min-h-[280px] sm:min-h-[320px] rounded-2xl border border-border/40 bg-transparent p-6 md:p-8",
              "hover:border-border hover:bg-muted/5",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "last:sm:col-span-2 last:lg:col-span-1", // На планшетах последняя красиво растянется, на десктопе — строго в ряд
              isDisabled && "pointer-events-none opacity-50"
            )}
          >
            {/* Верхняя линия: Номер карточки */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60 transition-colors duration-300 group-hover:text-muted-foreground">
                {card.number}
              </span>
            </div>

            {/* Основной контент: Смещен чуть ниже центра для журнальной асимметрии */}
            <div className="mt-8 flex-1">
              <h3 className="mb-3 font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                {t(card.titleKey)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground/90 balanced">
                {t(card.descriptionKey)}
              </p>
            </div>

            {/* Нижня линия: Индикатор действия, прижатый к правому углу */}
            <div className="mt-6 flex justify-end h-6 items-center overflow-hidden text-sm font-medium">
              {isLoading ? (
                <span className="flex items-center gap-2 text-primary">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-xs uppercase tracking-wider font-mono">{t('createCards.creating')}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-muted-foreground transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-foreground">
                  <span className="text-xs uppercase tracking-wider font-mono opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    {t('createCards.create')}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground/60 transition-colors duration-300 group-hover:text-foreground" />
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}