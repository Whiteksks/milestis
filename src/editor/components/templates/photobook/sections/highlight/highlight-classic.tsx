"use client"

import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface HighlightClassicProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightClassic({
  sectionContent,
  theme,
}: HighlightClassicProps) {
  const { highlight } = sectionContent
  const title = highlight.title || "A Special Moment"
  const description = highlight.description || ""
  const quote = highlight.quote || ""
  const imageUrl = highlight.images?.image || ""

  return (
    <section className="min-h-screen flex items-center justify-center p-8 md:p-16" style={{ backgroundColor: theme.background }}>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text side */}
        <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>Highlight</span>
            <h2 className={cn("font-serif text-4xl md:text-5xl lg:text-6xl leading-tight", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>
          </div>

          {description && (
            <p className={cn("text-lg leading-relaxed max-w-lg mx-auto lg:mx-0", theme.fontBody)} style={{ color: theme.mutedText }}>{description}</p>
          )}

          {quote && (
            <blockquote className="border-l-4 pl-6 py-2" style={{ borderColor: theme.border }}>
              <p className={cn("italic text-xl font-serif", theme.fontBody)} style={{ color: theme.foreground }}>&quot;{quote}&quot;</p>
            </blockquote>
          )}
        </div>

        {/* Photo side */}
        <div className="order-1 lg:order-2">
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute -inset-4 rounded-3xl -rotate-2" style={{ backgroundColor: theme.secondary }} />
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                loader={passthroughLoader}
                unoptimized
                src={imageUrl || "/placeholder.svg"}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
