"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function QuoteMinimal({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const text = block.settings.quoteText || "Quote text goes here"
  const author = block.settings.quoteAuthor || "Author Name"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-12 sm:py-16`}>
      <div className="container mx-auto max-w-3xl px-6">
        <blockquote className="text-xl sm:text-2xl font-medium">“{text}”</blockquote>
        <p className="mt-4 text-sm text-muted-foreground">— {author}</p>
      </div>
    </section>
  )
}
