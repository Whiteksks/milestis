"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { GalleryGrid } from "./variants/GalleryGrid"
import { GalleryMasonry } from "./variants/GalleryMasonry"
import { GalleryCarousel } from "./variants/GalleryCarousel"
import { GalleryFeatured } from "./variants/GalleryFeatured"

interface GalleryProps {
  block: CanvasBlock
  isSelected: boolean
}

export function Gallery({ block, isSelected }: GalleryProps) {
  const preset = block.settings?.preset || "grid"

  switch (preset) {
    case "grid":
      return <GalleryGrid block={block} isSelected={isSelected} />
    case "masonry":
      return <GalleryMasonry block={block} isSelected={isSelected} />
    case "carousel":
      return <GalleryCarousel block={block} isSelected={isSelected} />
    case "featured":
      return <GalleryFeatured block={block} isSelected={isSelected} />
    default:
      return <GalleryGrid block={block} isSelected={isSelected} />
  }
}
