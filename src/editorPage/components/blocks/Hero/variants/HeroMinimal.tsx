"use client"

import { Button } from "@/components/ui/button"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface HeroMinimalProps {
  block: CanvasBlock
  isSelected: boolean
}

export function HeroMinimal({ block, isSelected }: HeroMinimalProps) {
  const title = block.settings.heroTitle || "Hero Title"
  const buttons = block.settings.heroButtons || [{ text: "Get Started", href: "#", variant: "primary" as const }]

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <div className="mt-8">
            {buttons.slice(0, 1).map((btn, idx) => (
              <Button key={idx} variant={btn.variant === "primary" ? "default" : "outline"} size="lg">
                {btn.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
