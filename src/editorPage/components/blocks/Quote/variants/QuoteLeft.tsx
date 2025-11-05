"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function QuoteLeft({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const text = block.settings.quoteText || "Quote text goes here"
  const author = block.settings.quoteAuthor || "Author Name"
  const role = block.settings.quoteRole || "Role"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl grid gap-8 lg:grid-cols-[80px_1fr] items-start">
          <div className="h-16 w-16 rounded-full bg-primary/10" />
          <div>
            <blockquote className="text-2xl sm:text-3xl font-medium italic">“{text}”</blockquote>
            <div className="mt-6">
              <p className="font-semibold">{author}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
