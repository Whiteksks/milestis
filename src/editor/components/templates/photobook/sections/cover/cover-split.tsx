"use client"

import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface CoverSplitProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverSplit({ sectionContent, theme }: CoverSplitProps) {
  const { cover } = sectionContent
  const title = cover.title
  const subtitle = cover.subtitle || cover.tagline || ''
  const dateRange = cover.date || ''
  const location = cover.location || ''
  const imageUrl = cover.images?.image || ''

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 relative">
        {imageUrl && (
          <Image
            loader={passthroughLoader}
            unoptimized
            src={imageUrl}
            alt={title}
            fill
            sizes="50vw"
            className="object-cover"
          />
        )}
      </div>

      {/* Right side - Content */}
      <div className="w-1/2 flex flex-col justify-center px-12 lg:px-20" style={{ backgroundColor: theme.background }}>
        <div className="max-w-md">
          <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ color: theme.accent }}>{dateRange}</p>

          <h1 className={cn("font-serif text-4xl lg:text-5xl xl:text-6xl leading-tight mb-6", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h1>

          <div className="w-16 h-px mb-6" style={{ backgroundColor: theme.border }} />

          <p className={cn("font-serif text-lg italic mb-8", theme.fontBody)} style={{ color: theme.mutedText }}>{subtitle}</p>

          <p className="text-sm tracking-wide" style={{ color: theme.mutedText }}>{location}</p>
        </div>
      </div>
    </div>
  )
}
