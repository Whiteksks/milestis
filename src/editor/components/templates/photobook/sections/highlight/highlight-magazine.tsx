"use client"

import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface HighlightMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightMagazine({
  sectionContent,
  theme,
}: HighlightMagazineProps) {
  const { highlight } = sectionContent
  const title = highlight.title || "A Special Moment"
  const description = highlight.description || ""
  const quote = highlight.quote || ""
  const imageUrl = highlight.images?.image || ""

  const words = title.split(" ")

  return (
    <section className="relative min-h-screen">
      {/* Background photo */}
      <div className="absolute inset-0">
        {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      </div>

      {/* Magazine-style layout */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-8 md:p-16">
        {/* Top: HIGHLIGHT badge */}
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold uppercase tracking-[0.3em] border px-3 py-1" style={{ color: theme.accent, borderColor: theme.accent }}>
            Highlight
          </span>
          <span className="text-white/50 text-sm tracking-widest">★★★</span>
        </div>

        {/* Center: Large title */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {words.map((word, i) => (
              <div
                key={i}
                className={cn("font-serif text-6xl md:text-8xl lg:text-9xl leading-none", theme.fontTitle)}
                style={{
                  color: i % 2 === 0 ? "white" : "transparent",
                  WebkitTextStroke: i % 2 === 0 ? "none" : "2px white"
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Description and quote */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          {description && <p className={cn("text-white/70 max-w-md leading-relaxed text-sm md:text-base", theme.fontBody)}>{description}</p>}
          {quote && <p className={cn("italic text-lg font-serif text-white/90 max-w-sm text-right", theme.fontBody)}>"{quote}"</p>}
        </div>
      </div>
    </section>
  )
}
