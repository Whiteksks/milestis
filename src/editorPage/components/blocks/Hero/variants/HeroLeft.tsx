"use client"

import { Button } from "@/components/ui/button"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface HeroLeftProps {
  block: CanvasBlock
  isSelected: boolean
}

export function HeroLeft({ block, isSelected }: HeroLeftProps) {
  const title = block.settings.heroTitle || "Hero Title"
  const subtitle = block.settings.heroSubtitle || "Hero subtitle goes here"
  const buttons = block.settings.heroButtons || [{ text: "Get Started", href: "#", variant: "primary" as const }]
  const image = block.settings.heroImage

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">{subtitle}</p>
            <div className="mt-8 flex items-center gap-4">
              {buttons.map((btn, idx) => (
                <Button key={idx} variant={btn.variant === "primary" ? "default" : "outline"} size="lg">
                  {btn.text}
                </Button>
              ))}
            </div>
          </div>
          {image && (
            <div className="flex items-center">
              <img src={image || "/placeholder.svg"} alt="Hero" className="rounded-lg shadow-xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
