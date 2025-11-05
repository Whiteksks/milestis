"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function TextCentered({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const heading = block.settings.textHeading || "Text Heading"
  const content = block.settings.textContent || "Text content goes here"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-20 sm:py-28`}>
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          {heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{content}</p>
      </div>
    </section>
  )
}
