"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface QuoteBlockProps {
  block: CanvasBlock
  isSelected: boolean
}

export function QuoteBlock({ block, isSelected }: QuoteBlockProps) {
  const text = block.settings.quoteText || "Quote text goes here"
  const author = block.settings.quoteAuthor || "Author Name"
  const role = block.settings.quoteRole || "Role"

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <blockquote className="text-2xl font-medium italic sm:text-3xl">"{text}"</blockquote>
        <div className="mt-8">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  )
}
