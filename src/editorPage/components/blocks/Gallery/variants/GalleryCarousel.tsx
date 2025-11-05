"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { GALLERY_PRESETS } from "@/editorPage/lib/presets/galleryPresets"

interface GalleryCarouselProps {
  block: CanvasBlock
  isSelected: boolean
}

export function GalleryCarousel({ block, isSelected }: GalleryCarouselProps) {
  const preset = GALLERY_PRESETS.carousel
  const images = block.settings.galleryImages || []

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-4xl">
          {images.length > 0 && (
            <div className="relative overflow-hidden rounded-lg">
              <img src={images[0].url || "/placeholder.svg"} alt={images[0].caption} className="w-full" />
              {preset.hasCaption && images[0].caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-white">{images[0].caption}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
