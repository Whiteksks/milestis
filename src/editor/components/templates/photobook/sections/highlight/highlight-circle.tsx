"use client"

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface HighlightCircleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightCircle({ sectionContent, theme }: HighlightCircleProps) {
  const title = sectionContent.highlight.title || 'Highlight'
  const description = sectionContent.highlight.description
  const quote = sectionContent.highlight.quote
  const imageUrl = sectionContent.highlight.images?.image

  return (
    <section className="min-h-screen bg-amber-50 flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 mb-8 block">Highlight</span>

        {/* Large circle photo */}
        <div className="relative mx-auto mb-12 w-72 h-72 md:w-96 md:h-96">
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-300/50 scale-110" />
          <div className="absolute inset-0 rounded-full border border-amber-200/30 scale-125" />
          <div
            className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 scale-105 animate-spin"
            style={{ animationDuration: "60s" }}
          />

          <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white">
            <Image
              loader={passthroughLoader}
              unoptimized
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              sizes="(max-width: 768px) 288px, 384px"
              className="object-cover"
            />
          </div>
        </div>

        <h2 className={cn('text-4xl md:text-6xl text-stone-800 mb-6', theme.fontTitle)}>{title}</h2>

        {description && <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto mb-8">{description}</p>}

        {quote && <p className={cn('italic text-2xl text-amber-800', theme.fontTitle)}>&quot;{quote}&quot;</p>}
      </div>
    </section>
  )
}
