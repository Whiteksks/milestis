"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function QuoteCentered({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const text = block.settings.quoteText || "Quote text goes here"
  const author = block.settings.quoteAuthor || "Author Name"
  const role = block.settings.quoteRole || "Role"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-20`}>
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <blockquote className="text-3xl sm:text-4xl font-semibold italic">“{text}”</blockquote>
        <div className="mt-8">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </section>
  )
}
