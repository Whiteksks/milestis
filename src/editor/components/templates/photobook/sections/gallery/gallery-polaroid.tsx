"use client"

import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface GalleryPolaroidProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryPolaroid({
  sectionContent,
  theme,
}: GalleryPolaroidProps) {
  const { gallery } = sectionContent
  const title = gallery.title || "Gallery"
  const description = gallery.description || ""
  const images = gallery.images?.map(block => block.image) || []

  const rotations = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"]

  return (
    <section className="min-h-screen py-16 px-6" style={{ backgroundColor: theme.background }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={cn("font-serif text-3xl md:text-4xl mb-4", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>
          <p className="max-w-xl mx-auto italic" style={{ color: theme.mutedText }}>{description}</p>
        </div>

        {/* Polaroid Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {images.map((img, index) => (
            <div
              key={index}
              className={`p-3 pb-12 shadow-lg hover:shadow-xl transition-shadow ${rotations[index % rotations.length]}`}
              style={{ backgroundColor: theme.card }}
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
              <p className="mt-4 text-center text-sm font-handwriting" style={{ color: theme.mutedText }}>Moment {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
