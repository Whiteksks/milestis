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
    number: "01", // Добавляем журнальную нумерацию
    titleKey: "createCards.photobook.title",
    descriptionKey: "createCards.photobook.description",
  },
  {
    mode: "portfolio",
    number: "02",
    titleKey: "createCards.portfolio.title",
    descriptionKey: "createCards.portfolio.description",
  },
]

export function CreateCards() {
  const { handleCreate, loadingMode } = useCreateProject()
  const t = useTranslations()

  return (
    // mb-12 задает отступ до секции Recent Projects
    <div className="mb-12 grid gap-6 md:grid-cols-2">
      {cards.map((card) => {
        const isLoading = loadingMode === card.mode
        // Блокируем обе карточки, если идет загрузка любой из них
        const isDisabled = !!loadingMode 

        return (
          <button
            key={card.mode}
            onClick={() => handleCreate(card.mode)}
            disabled={isDisabled}
            className={cn(
              "group relative flex flex-col text-left transition-all duration-500 ease-out",
              "rounded-2xl border border-border/40 bg-transparent p-6 md:p-8 lg:p-10",
              "hover:border-border hover:bg-muted/10",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              isDisabled && "pointer-events-none opacity-60"
            )}
          >
            {/* Editorial Header: Моноширинный номер и тонкая иконка */}
            <div className="absolute right-6 top-6 md:right-8 md:top-8">
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                {card.number}
              </span>
            </div>

            {/* Контент: Убрали лишний mb-6 у заголовка, так как номера сверху больше нет */}
            <div className="flex-1">
              <h3 className="mb-3 font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl lg:text-4xl">
                {t(card.titleKey)}
              </h3>
              <p className="max-w-[95%] text-sm leading-relaxed text-muted-foreground md:text-base">
                {t(card.descriptionKey)}
              </p>
            </div>

            {/* Индикатор действия (Скрыт по умолчанию, появляется при ховере) */}
            <div className="mt-8 flex h-6 items-center overflow-hidden text-sm font-medium">
              {isLoading ? (
                <span className="flex items-center gap-2 text-primary">
                  <Loader2 className="size-4 animate-spin" />
                  {t('createCards.creating')}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-foreground/80 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-foreground">
                  {t('createCards.create')}
                  <ArrowRight className="size-4 -translate-x-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}