"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { TextSingle } from "./variants/TextSingle"
import { TextTwoColumn } from "./variants/TextTwoColumn"
import { TextCentered } from "./variants/TextCentered"
import { TextSidebar } from "./variants/TextSidebar"

interface TextProps {
  block: CanvasBlock
  isSelected: boolean
}

export function Text({ block, isSelected }: TextProps) {
  const preset = block.settings?.preset || "single"

  switch (preset) {
    case "single":
      return <TextSingle block={block} isSelected={isSelected} />
    case "twoColumn":
      return <TextTwoColumn block={block} isSelected={isSelected} />
    case "centered":
      return <TextCentered block={block} isSelected={isSelected} />
    case "sidebar":
      return <TextSidebar block={block} isSelected={isSelected} />
    default:
      return <TextSingle block={block} isSelected={isSelected} />
  }
}
