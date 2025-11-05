"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { CtaCentered } from "./variants/CtaCentered"
import { CtaSplit } from "./variants/CtaSplit"
import { CtaBanner } from "./variants/CtaBanner"
import { CtaCard } from "./variants/CtaCard"

export function Cta({ block, isSelected }: { block: CanvasBlock; isSelected: boolean }) {
  const preset = block.settings?.preset || "centered"
  switch (preset) {
    case "centered":
      return <CtaCentered block={block} isSelected={isSelected} />
    case "split":
      return <CtaSplit block={block} isSelected={isSelected} />
    case "banner":
      return <CtaBanner block={block} isSelected={isSelected} />
    case "card":
      return <CtaCard block={block} isSelected={isSelected} />
    default:
      return <CtaCentered block={block} isSelected={isSelected} />
  }
}
