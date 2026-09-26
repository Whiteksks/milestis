"use client"

import { ArrowRight, Loader2 } from "lucide-react"
import { useCreateProject } from "@/hooks/useCreateProject"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { PROJECT_CREATION_OPTIONS as cards } from "@/lib/projects/creation-options"


export function CreateCards() {
  const { handleCreate, loadingMode } = useCreateProject()
  const t = useTranslations()

  return (
    <div className="mb-8">
      {/* Grid container */}
      <div className="grid border-y border-border lg:grid-cols-3">
        {cards.map((card, index) => {
          const isLoading = loadingMode === card.mode
          const isDisabled = !!loadingMode
          const isFirst = index === 0

          return (
            <button
              key={card.mode}
              onClick={() => handleCreate(card.mode)}
              disabled={isDisabled}
              className={cn(
                "group relative flex min-h-[220px] flex-col justify-between text-left",
                "px-5 py-6 md:px-6",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",

                // Swiss grid borders
                "border-border lg:border-r",
                "last:border-r-0",
                "border-b lg:border-b-0",

                // Interaction state
                "hover:bg-muted/50",
                isDisabled && "pointer-events-none opacity-50"
              )}
            >
              {/* Header: Number + Status dot */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "font-mono text-xs font-medium tabular-nums uppercase tracking-widest",
                    isFirst ? "text-foreground" : "text-muted-foreground/60"
                  )}
                >
                  {card.number}
                </span>

                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-[oklch(0.48_0.055_105)] opacity-70 transition-opacity group-hover:opacity-100"
                />
              </div>

              {/* Main content */}
              <div className="my-4 space-y-1.5">
                <h3 className="font-serif text-xl font-medium tracking-tight text-foreground md:text-2xl">
                  {t(card.titleKey)}
                </h3>

                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {t(card.descriptionKey)}
                </p>
              </div>

              {/* Action footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 transition-colors group-hover:text-foreground">
                  {isLoading
                    ? t("createCards.creating")
                    : t("createCards.create")}
                </span>

                <span className="flex size-7 items-center justify-center rounded-xs border border-border/60 transition-colors group-hover:border-primary group-hover:text-primary">
                  {isLoading ? (
                    <Loader2 className="size-3 animate-spin text-primary" />
                  ) : (
                    <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  )}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
