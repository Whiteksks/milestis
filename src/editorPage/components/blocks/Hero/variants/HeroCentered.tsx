"use client"

import { Button } from "@/components/ui/button"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface HeroCenteredProps {
  block: CanvasBlock
  isSelected: boolean
}

export function HeroCentered({ block, isSelected }: HeroCenteredProps) {
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
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">{subtitle}</p>
          <div className="mt-10 flex items-center justify-center gap-4">
            {buttons.map((btn, idx) => (
              <Button key={idx} variant={btn.variant === "primary" ? "default" : "outline"} size="lg">
                {btn.text}
              </Button>
            ))}
          </div>
          {image && (
            <div className="mt-16 w-full max-w-4xl">
              <img src={image || "/placeholder.svg"} alt="Hero" className="rounded-lg shadow-2xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
