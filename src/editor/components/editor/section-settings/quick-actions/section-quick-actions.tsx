"use client"

import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"

import type { EditorMode } from "@/editor/lib/types"

import { getPortfolioQuickActions } from "./portfolio-quick-actions"
import { getPhotobookQuickActions } from "./photobook-quick-actions"

export interface SectionQuickAction {
  id: string
  title: string
  Icon: LucideIcon
  Panel: ComponentType<{ dense?: boolean }>
}

export function getSectionQuickActions(mode: EditorMode, sectionId: string): SectionQuickAction[] {
  if (mode === "portfolio") return getPortfolioQuickActions(sectionId)
  if (mode === "photobook") return getPhotobookQuickActions(sectionId)
  return []
}
