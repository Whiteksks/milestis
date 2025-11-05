"use client"

import { Button } from "@/components/ui/button"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface HeroSplitProps {
  block: CanvasBlock
  isSelected: boolean
}

export function HeroSplit({ block, isSelected }: HeroSplitProps) {
  const title = block.settings.heroTitle || "Hero Title"
  const subtitle = block.settings.heroSubtitle || "Hero subtitle goes here"
  const buttons = block.settings.heroButtons || [{ text: "Get Started", href: "#", variant: "primary" as const }]
  const image = block.settings.heroImage

  return (
    <div className={`relative ${block.settings.background} ${block.settings.textColor}`}>
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-8 py-16 lg:px-16">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">{subtitle}</p>
          <div className="mt-8">
            {buttons.slice(0, 1).map((btn, idx) => (
              <Button key={idx} variant={btn.variant === "primary" ? "default" : "outline"} size="lg">
                {btn.text}
              </Button>
            ))}
          </div>
        </div>
        {image && (
          <div className="relative h-full min-h-[400px]">
            <img src={image || "/placeholder.svg"} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        )}
      </div>
    </div>
  )
}
