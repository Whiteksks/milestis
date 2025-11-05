"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function TextSingle({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const heading = block.settings.textHeading || "Text Heading"
  const content = block.settings.textContent || "Text content goes here"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto max-w-3xl px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{heading}</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{content}</p>
      </div>
    </section>
  )
}
