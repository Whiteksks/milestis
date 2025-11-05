"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { TestimonialsCarousel } from "./variants/TestimonialsCarousel"
import { TestimonialsGrid } from "./variants/TestimonialsGrid"
import { TestimonialsSingle } from "./variants/TestimonialsSingle"
import { TestimonialsMasonry } from "./variants/TestimonialsMasonry"

export function Testimonials({ block, isSelected }: { block: CanvasBlock; isSelected: boolean }) {
  const preset = block.settings?.preset || "grid"
  switch (preset) {
    case "carousel":
      return <TestimonialsCarousel block={block as any} isSelected={isSelected} />
    case "grid":
      return <TestimonialsGrid block={block} isSelected={isSelected} />
    case "single":
      return <TestimonialsSingle block={block} isSelected={isSelected} />
    case "masonry":
      return <TestimonialsMasonry block={block} isSelected={isSelected} />
    default:
      return <TestimonialsGrid block={block} isSelected={isSelected} />
  }
}
