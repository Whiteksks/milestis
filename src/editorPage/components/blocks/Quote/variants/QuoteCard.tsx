"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function QuoteCard({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const text = block.settings.quoteText || "Quote text goes here"
  const author = block.settings.quoteAuthor || "Author Name"
  const role = block.settings.quoteRole || "Role"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 shadow">
          <blockquote className="text-2xl sm:text-3xl font-medium italic">“{text}”</blockquote>
          <div className="mt-6">
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
