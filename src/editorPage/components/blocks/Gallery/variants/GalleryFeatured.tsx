"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface GalleryFeaturedProps {
  block: CanvasBlock
  isSelected: boolean
}

export function GalleryFeatured({ block, isSelected }: GalleryFeaturedProps) {
  const images = block.settings.galleryImages || []

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-4 lg:grid-cols-2">
          {images[0] && (
            <div className="relative overflow-hidden rounded-lg lg:row-span-2">
              <img
                src={images[0].url || "/placeholder.svg"}
                alt={images[0].caption}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {images.slice(1, 5).map((img: any) => (
              <div key={img.id} className="relative overflow-hidden rounded-lg">
                <img src={img.url || "/placeholder.svg"} alt={img.caption} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
