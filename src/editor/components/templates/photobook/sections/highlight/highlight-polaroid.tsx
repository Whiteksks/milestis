"use client"

import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface HighlightPolaroidProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightPolaroid({
  sectionContent,
  theme,
}: HighlightPolaroidProps) {
  const { highlight } = sectionContent
  const title = highlight.title || "A Special Moment"
  const description = highlight.description || ""
  const quote = highlight.quote || ""
  const imageUrl = highlight.images?.image || ""

  return (
    <section className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: theme.background }}>
      <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl">
        {/* Large Polaroid card */}
        <div
          className="p-4 md:p-6 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500"
          style={{ 
            backgroundColor: theme.card,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" 
          }}
        >
          <div className="aspect-[4/5] w-72 md:w-96 overflow-hidden">
            {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover" />}
          </div>
          {/* Handwritten-style caption */}
          <div className="pt-6 pb-2 text-center">
            <p className={cn("font-serif italic text-xl", theme.fontBody)} style={{ color: theme.mutedText }}>{title}</p>
          </div>
        </div>

        {/* Text content */}
        <div className="text-center lg:text-left max-w-md space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>Highlight</span>

          <h2 className={cn("font-serif text-4xl md:text-5xl leading-tight", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>

          {description && <p className={cn("text-lg leading-relaxed", theme.fontBody)} style={{ color: theme.mutedText }}>{description}</p>}

          {quote && <p className={cn("italic text-xl font-serif", theme.fontBody)} style={{ color: theme.foreground }}>"{quote}"</p>}
        </div>
      </div>
    </section>
  )
}
