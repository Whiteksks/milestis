"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { HeroCentered } from "./variants/HeroCentered"
import { HeroLeft } from "./variants/HeroLeft"
import { HeroSplit } from "./variants/HeroSplit"
import { HeroMinimal } from "./variants/HeroMinimal"

interface HeroProps {
  block: CanvasBlock
  isSelected: boolean
}

export function Hero({ block, isSelected }: HeroProps) {
  const preset = block.settings?.preset || "centered"

  switch (preset) {
    case "centered":
      return <HeroCentered block={block} isSelected={isSelected} />
    case "left":
      return <HeroLeft block={block} isSelected={isSelected} />
    case "split":
      return <HeroSplit block={block} isSelected={isSelected} />
    case "minimal":
      return <HeroMinimal block={block} isSelected={isSelected} />
    default:
      return <HeroCentered block={block} isSelected={isSelected} />
  }
}
