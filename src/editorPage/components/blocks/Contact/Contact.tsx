"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { ContactSimple } from "./variants/ContactSimple"
import { ContactSplit } from "./variants/ContactSplit"
import { ContactCentered } from "./variants/ContactCentered"
import { ContactSidebar } from "./variants/ContactSidebar"

export function Contact({ block, isSelected }: { block: CanvasBlock; isSelected: boolean }) {
  const preset = block.settings?.preset || "simple"
  switch (preset) {
    case "simple":
      return <ContactSimple block={block} isSelected={isSelected} />
    case "split":
      return <ContactSplit block={block} isSelected={isSelected} />
    case "centered":
      return <ContactCentered block={block} isSelected={isSelected} />
    case "sidebar":
      return <ContactSidebar block={block} isSelected={isSelected} />
    default:
      return <ContactSimple block={block} isSelected={isSelected} />
  }
}
