"use client"

import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface GalleryMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryMagazine({
  sectionContent,
  theme,
}: GalleryMagazineProps) {
  const { gallery } = sectionContent
  const title = gallery.title || "Gallery"
  const description = gallery.description || ""
  const images = gallery.images?.map(block => block.image) || []

  return (
    <section className="min-h-screen" style={{ backgroundColor: theme.background }}>
      {/* Feature image */}
      <div className="relative h-[70vh]">
        {images[0] && <img src={images[0]} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent" style={{ '--tw-gradient-from': theme.background } as any} />
        <div className="absolute bottom-8 left-8 right-8">
          <h2 className={cn("font-serif text-5xl md:text-7xl", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>
        </div>
      </div>

      {/* Alternating layout */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="max-w-xl mb-16" style={{ color: theme.mutedText }}>{description}</p>

        <div className="space-y-24">
          {images.slice(1).map((img, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="flex-1 relative aspect-[4/3] overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="font-serif text-8xl opacity-20" style={{ color: theme.mutedText }}>{String(index + 2).padStart(2, "0")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
