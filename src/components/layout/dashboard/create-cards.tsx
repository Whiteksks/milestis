"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { BookOpen, Layout, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createProject } from "@/lib/create-project-api"

type ProjectMode = "portfolio" | "photobook"

const adjectives = ["golden", "summer", "bright", "quiet", "fresh", "warm", "misty", "tender", "vivid", "calm", "gentle", "secret", "serene", "radiant", "timeless"]
const nouns = ["memories", "journey", "story", "moments", "chapter", "escape", "lens", "voyage", "canvas", "light", "bloom", "horizon", "portrait", "archive", "collection"]

function randomProjectName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj} ${noun}`
}

const cards: { mode: ProjectMode; icon: typeof BookOpen; title: string; description: string; badge: string | null; secondary: string }[] = [
  {
    mode: "photobook",
    icon: BookOpen,
    title: "Memory Book",
    description: "Create an interactive photo book with ready-made presets. Perfect for preserving memories.",
    badge: "Uses credits",
    secondary: "Browse presets",
  },
  {
    mode: "portfolio",
    icon: Layout,
    title: "Portfolio Site",
    description: "Build a clean personal site without design skills. Showcase your work beautifully.",
    badge: null,
    secondary: "View examples",
  },
]

export function CreateCards() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  const [loadingMode, setLoadingMode] = useState<ProjectMode | null>(null)

  async function handleCreate(mode: ProjectMode) {
    if (loadingMode) return
    setLoadingMode(mode)
    try {
      const projectId = await createProject(randomProjectName(), mode)
      router.push(`/${locale}/design/${projectId}/edit`)
    } catch (err) {
      console.error('[CreateCards] Failed to create project:', err)
      setLoadingMode(null)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => {
        const isLoading = loadingMode === card.mode
        return (
          <div
            key={card.title}
            className="group rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent">
                <card.icon className="size-5 text-primary" />
              </div>
              {card.badge && (
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="size-3" />
                  {card.badge}
                </span>
              )}
            </div>

            <h3 className="font-serif text-xl font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>

            <div className="mt-6 flex gap-3">
              <Button
                className="rounded-full gap-2 px-6"
                disabled={!!loadingMode}
                onClick={() => handleCreate(card.mode)}
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
                {isLoading ? "Creating…" : "Create"}
              </Button>
              <Button variant="ghost" className="rounded-full px-6 text-muted-foreground hover:text-foreground">
                {card.secondary}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
