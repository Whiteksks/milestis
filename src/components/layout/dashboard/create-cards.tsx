"use client"

import { BookOpen, Layout, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCreateProject } from "@/hooks/useCreateProject"
import { useTranslations } from "next-intl"

type ProjectMode = "portfolio" | "photobook"

const cards: { mode: ProjectMode; icon: typeof BookOpen; titleKey: string; descriptionKey: string; badgeKey?: string | null; secondaryKey: string }[] = [
  {
    mode: "photobook",
    icon: BookOpen,
    titleKey: "createCards.photobook.title",
    descriptionKey: "createCards.photobook.description",
    badgeKey: "createCards.photobook.badge",
    secondaryKey: "createCards.photobook.secondary",
  },
  {
    mode: "portfolio",
    icon: Layout,
    titleKey: "createCards.portfolio.title",
    descriptionKey: "createCards.portfolio.description",
    badgeKey: null,
    secondaryKey: "createCards.portfolio.secondary",
  },
]

export function CreateCards() {
  const { handleCreate, loadingMode } = useCreateProject()
  const t = useTranslations()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => {
        const isLoading = loadingMode === card.mode
        return (
          <div
            key={card.titleKey}
            className="group rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent">
                <card.icon className="size-5 text-primary" />
              </div>
              {card.badgeKey && (
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="size-3" />
                  {t(card.badgeKey)}
                </span>
              )}
            </div>

            <h3 className="font-serif text-xl font-semibold">{t(card.titleKey)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(card.descriptionKey)}</p>

            <div className="mt-6 flex gap-3">
              <Button
                className="rounded-full gap-2 px-6"
                disabled={!!loadingMode}
                onClick={() => handleCreate(card.mode)}
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
                {isLoading ? t('createCards.creating') : t('createCards.create')}
              </Button>
              <Button variant="ghost" className="rounded-full px-6 text-muted-foreground hover:text-foreground">
                {t(card.secondaryKey)}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
