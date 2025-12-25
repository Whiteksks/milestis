"use client"

import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface GalleryMasonryProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryMasonry({
  sectionContent,
  theme,
}: GalleryMasonryProps) {
  const { gallery } = sectionContent
  const title = gallery.title || "Gallery"
  const description = gallery.description || ""
  const images = gallery.images?.map(block => block.image) || []

  // Distribute images into columns
  const columns = [
    images.filter((_, i) => i % 3 === 0),
    images.filter((_, i) => i % 3 === 1),
    images.filter((_, i) => i % 3 === 2),
  ]

  const heights = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-[4/3]"]

  return (
    <section className="min-h-screen py-16 px-6" style={{ backgroundColor: theme.background }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className={cn("font-serif text-3xl md:text-4xl mb-4", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>
          <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: theme.border }} />
          <p className="max-w-xl" style={{ color: theme.mutedText }}>{description}</p>
        </div>

        {/* Masonry Grid */}
        <div className="flex gap-4">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex-1 flex flex-col gap-4">
              {column.map((img, imgIndex) => (
                <div key={imgIndex} className={`relative overflow-hidden rounded-sm ${heights[(colIndex + imgIndex) % heights.length]}`}>
                  <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
