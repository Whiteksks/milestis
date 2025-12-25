"use client"

import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface HighlightVerticalProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightVertical({
  sectionContent,
  theme,
}: HighlightVerticalProps) {
  const { highlight } = sectionContent
  const title = highlight.title || "A Special Moment"
  const description = highlight.description || ""
  const quote = highlight.quote || ""
  // highlight.images is PhotoBlock (single object)
  const imageUrl = highlight.images?.image || ""

  return (
    <section className="relative min-h-screen" style={{ backgroundColor: theme.background }}>
      {/* Background photo */}
      <div className="absolute inset-0">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Vertical text on left */}
      <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 z-10">
        <div
          className="text-6xl md:text-8xl font-serif tracking-widest"
          style={{ 
            writingMode: "vertical-rl", 
            textOrientation: "mixed",
            color: theme.muted
          }}
        >
          HIGHLIGHT
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-start pl-24 md:pl-40 pr-8">
        <div className="max-w-xl space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>Special Moment</span>

          <h2 className={cn("font-serif text-4xl md:text-6xl leading-tight", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>

          {description && <p className={cn("text-lg leading-relaxed", theme.fontBody)} style={{ color: theme.mutedText }}>{description}</p>}

          {quote && (
            <p className="italic text-xl font-serif border-l-2 pl-4" style={{ color: theme.foreground, borderColor: theme.accent }}>"{quote}"</p>
          )}
        </div>
      </div>
    </section>
  )
}
