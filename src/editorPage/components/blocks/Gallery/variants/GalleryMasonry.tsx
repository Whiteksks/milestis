"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { GALLERY_PRESETS } from "@/editorPage/lib/presets/galleryPresets"

interface GalleryMasonryProps {
  block: CanvasBlock
  isSelected: boolean
}

export function GalleryMasonry({ block, isSelected }: GalleryMasonryProps) {
  const preset = GALLERY_PRESETS.masonry
  const images = block.settings.galleryImages || []

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {images.map((img: any) => (
            <div key={img.id} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-lg">
              <img
                src={img.url || "/placeholder.svg"}
                alt={img.caption}
                className="w-full transition-transform duration-300 group-hover:scale-105"
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
