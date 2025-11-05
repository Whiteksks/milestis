"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { FeaturesGrid } from "./variants/FeaturesGrid"
import { FeaturesList } from "./variants/FeaturesList"
import { FeaturesCards } from "./variants/FeaturesCards"
import { FeaturesAlternating } from "./variants/FeaturesAlternating"

export function Features({ block, isSelected }: { block: CanvasBlock; isSelected: boolean }) {
  const preset = block.settings?.preset || "grid"
  switch (preset) {
    case "grid":
      return <FeaturesGrid block={block} isSelected={isSelected} />
    case "list":
      return <FeaturesList block={block} isSelected={isSelected} />
    case "cards":
      return <FeaturesCards block={block} isSelected={isSelected} />
    case "alternating":
      return <FeaturesAlternating block={block} isSelected={isSelected} />
    default:
      return <FeaturesGrid block={block} isSelected={isSelected} />
  }
}
