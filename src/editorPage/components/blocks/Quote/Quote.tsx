"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { QuoteCentered } from "./variants/QuoteCentered"
import { QuoteLeft } from "./variants/QuoteLeft"
import { QuoteCard } from "./variants/QuoteCard"
import { QuoteMinimal } from "./variants/QuoteMinimal"

export function Quote({ block, isSelected }: { block: CanvasBlock; isSelected: boolean }) {
  const preset = block.settings?.preset || "centered"
  switch (preset) {
    case "centered":
      return <QuoteCentered block={block} isSelected={isSelected} />
    case "left":
      return <QuoteLeft block={block} isSelected={isSelected} />
    case "card":
      return <QuoteCard block={block} isSelected={isSelected} />
    case "minimal":
      return <QuoteMinimal block={block} isSelected={isSelected} />
    default:
      return <QuoteCentered block={block} isSelected={isSelected} />
  }
}
