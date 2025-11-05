"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function TextTwoColumn({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const heading = block.settings.textHeading || "Text Heading"
  const content = block.settings.textContent || "Text content goes here"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-8">{heading}</h2>
          <div className="grid gap-6 sm:grid-cols-2 text-muted-foreground leading-relaxed">
            <p>{content}</p>
            <p>{content}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
