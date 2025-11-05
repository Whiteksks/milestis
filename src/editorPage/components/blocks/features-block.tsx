"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface FeaturesBlockProps {
  block: CanvasBlock
  isSelected: boolean
}

export function FeaturesBlock({ block, isSelected }: FeaturesBlockProps) {
  const title = block.settings.featuresTitle || "Features"
  const items = block.settings.featuresItems || []

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item: any) => (
            <div key={item.id} className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                {item.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
