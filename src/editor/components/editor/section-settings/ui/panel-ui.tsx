"use client"

import { cn } from "@/lib/utils"
import type React from "react"

// ─── Styles ────────────────────────────────────────────

/** Underline-only input: editorial style with clear affordance */
export const editorialInput =
  "border-0 border-b border-border/40 bg-transparent rounded-none px-0 py-1.5 h-auto focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/30 focus-visible:border-foreground/60 transition-colors"

/** Editorial uppercase label */
export const editorialLabel =
  "text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-2 block font-medium"

// ─── Panel styles (ps) ────────────────────────────────────

const _input = editorialInput
const _textarea = (minH: string) =>
  `${_input} ${minH} resize-none overflow-x-hidden break-words w-full`

export const ps = {
  root: (dense: boolean) => (dense ? "space-y-2" : "space-y-2.5"),
  grid2: (dense: boolean) => (dense ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-2.5"),
  input: `${_input} text-xs`,
  inputFlex: `flex-1 ${_input} text-xs`,
  textarea: (dense: boolean, denseH = "min-h-20", normalH = "min-h-24") =>
    `${_textarea(dense ? denseH : normalH)} text-xs`,
  addBtn: "h-7 text-xs text-muted-foreground hover:text-foreground px-2",
  deleteBtn: "h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted shrink-0",
  emptyZone:
    "group w-full rounded-lg border border-dashed border-border hover:border-primary/50 bg-transparent hover:bg-muted/40 transition-colors px-4 py-4 flex flex-col items-center gap-1.5 cursor-pointer",
  emptyIcon: "w-4 h-4 text-muted-foreground/50 group-hover:text-primary/60 transition-colors",
  emptyText: "text-[11px] text-muted-foreground group-hover:text-foreground transition-colors",
  // Photobook panels
  pbRoot: "space-y-3",
  pbGrid2: "grid grid-cols-2 gap-3",
  pbInput: `${_input} text-xs`,
  pbInputItalic: `${_input} text-xs italic`,
  pbInputTitle: `${_input} text-sm font-medium`,
  pbTextarea: `${_textarea("min-h-20")} text-xs`,
}

// ─── Limits ──────────────────────────────────────────────────────────────────

export const LIMITS = {
  // common text
  title: 60,
  subtitle: 80,
  description: 300,
  tagline: 100,
  quote: 150,
  dedication: 400,
  location: 80,
  date: 40,
  signature: 60,
  label: 50,
  caption: 200,
  // hero
  heroTitle: 60,
  heroSubtitle: 80,
  heroDescription: 300,
  // bio
  bio: 400,
  achievement: 100,
  count: 10,
  // contact
  email: 100,
  // featured work
  projectTitle: 60,
  projectDesc: 200,
  // footer
  copyright: 120,
  // header
  linkLabel: 30,
  links: 5,
  // item counts
  decorations: 10,
  featuredWorkProjects: 12,
  storyImages: 20,
  galleryImages: 30,
} as const

// ─── Components ──────────────────────────────────────────────────────────────

/** Shows remaining character count when >80% of limit is used */
export function CharCounter({ value, limit }: { value: string; limit: number }) {
  const remaining = limit - value.length
  const nearLimit = remaining <= Math.floor(limit * 0.2)
  if (!nearLimit) return null
  return (
    <span
      className={cn(
        "text-[10px] tabular-nums transition-colors",
        remaining <= 10 ? "text-destructive/70" : "text-muted-foreground/40",
      )}
    >
      {remaining}
    </span>
  )
}

/** Horizontal divider used between panels in section-settings */
export function PanelDivider({ className }: { className?: string }) {
  return <div className={cn("border-t border-border/30 my-1", className)} />
}

/** Editorial uppercase label as a React component */
export function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className={cn(editorialLabel, "select-none")}>
      {children}
    </label>
  )
}
