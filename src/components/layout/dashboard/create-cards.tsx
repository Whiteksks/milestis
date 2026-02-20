"use client"

import { BookOpen, Layout, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const cards = [
  {
    icon: BookOpen,
    title: "Memory Book",
    description: "Create an interactive photo book with ready-made presets. Perfect for preserving memories.",
    badge: "Uses credits",
    primary: "Create",
    secondary: "Browse presets",
  },
  {
    icon: Layout,
    title: "Portfolio Site",
    description: "Build a clean personal site without design skills. Showcase your work beautifully.",
    badge: null,
    primary: "Create",
    secondary: "View examples",
  },
]

export function CreateCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => (
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
            <Button className="rounded-full gap-2 px-6">{card.primary}</Button>
            <Button variant="ghost" className="rounded-full px-6 text-muted-foreground hover:text-foreground">
              {card.secondary}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
