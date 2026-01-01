"use client"

import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface CoverPolaroidProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverPolaroid({
  sectionContent,
  theme,
}: CoverPolaroidProps) {
  const { cover } = sectionContent
  const title = cover.title
  const subtitle = cover.subtitle || cover.tagline || ''
  const dateRange = cover.date || ''
  const location = cover.location || ''
  const imageUrl = cover.images?.image || ''

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: theme.background }}>
      <div className="text-center">
        {/* Polaroid frame */}
        <div
          className="inline-block p-4 pb-16 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 relative"
          style={{ 
            backgroundColor: theme.card,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)" 
          }}
        >
          <div className="w-72 h-80 sm:w-80 sm:h-96 overflow-hidden">
            {imageUrl && (
              <div className="relative w-full h-full">
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={imageUrl}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Handwritten-style text on polaroid */}
          <p className={cn("absolute bottom-5 left-0 right-0 text-center font-serif text-sm italic", theme.fontBody)} style={{ color: theme.mutedText }}>
            {dateRange}
          </p>
        </div>

        {/* Title below polaroid */}
        <div className="mt-12">
          <h1 className={cn("font-serif text-4xl lg:text-5xl mb-3", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h1>
          <p className={cn("font-serif text-lg italic mb-2", theme.fontBody)} style={{ color: theme.mutedText }}>{subtitle}</p>
          <p className="text-sm tracking-widest uppercase" style={{ color: theme.mutedText }}>{location}</p>
        </div>
      </div>
    </div>
  )
}
