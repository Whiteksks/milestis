"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { GALLERY_PRESETS } from "@/editorPage/lib/presets/galleryPresets"

interface GalleryGridProps {
  block: CanvasBlock
  isSelected: boolean
}

export function GalleryGrid({ block, isSelected }: GalleryGridProps) {
  const preset = GALLERY_PRESETS.grid
  const images = block.settings.galleryImages || []
  const spacingClass = preset.spacing === "tight" ? "gap-2" : preset.spacing === "loose" ? "gap-8" : "gap-4"

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${preset.columns} ${spacingClass}`}>
          {images.map((img: any) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg">
              <img
                src={img.url || "/placeholder.svg"}
                alt={img.caption}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {preset.hasCaption && img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-sm text-white">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
