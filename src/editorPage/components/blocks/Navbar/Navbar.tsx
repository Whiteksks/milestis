"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { NavbarCentered } from "./variants/NavbarCentered"
import { NavbarLeftAligned } from "./variants/NavbarLeftAligned"
import { NavbarMinimal } from "./variants/NavbarMinimal"
import { NavbarBold } from "./variants/NavbarBold"

interface NavbarProps {
  block: CanvasBlock
  isSelected?: boolean
  onSelect?: () => void
}

export function Navbar({ block, isSelected, onSelect }: NavbarProps) {
  const preset = block.settings?.preset || "centered"

  switch (preset) {
    case "centered":
      return <NavbarCentered block={block} isSelected={isSelected} onSelect={onSelect} />
    case "leftAligned":
      return <NavbarLeftAligned block={block} isSelected={isSelected} onSelect={onSelect} />
    case "minimal":
      return <NavbarMinimal block={block} isSelected={isSelected} onSelect={onSelect} />
    case "bold":
      return <NavbarBold block={block} isSelected={isSelected} onSelect={onSelect} />
    default:
      return <NavbarCentered block={block} isSelected={isSelected} onSelect={onSelect} />
  }
}
