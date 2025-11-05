"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface TextBlockProps {
  block: CanvasBlock
  isSelected: boolean
}

export function TextBlock({ block, isSelected }: TextBlockProps) {
  const heading = block.settings.textHeading || "Text Heading"
  const content = block.settings.textContent || "Text content goes here"

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
        <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">{content}</p>
      </div>
    </div>
  )
}
