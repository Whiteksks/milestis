import { getTheme } from '@/editor/lib/themes'

export interface PreviewColors {
  bg: string
  fg: string
  primary: string
  accent: string
  muted: string
  border: string
  card: string
}

/** Extracts the first 6-digit hex from a Tailwind arbitrary-value class, e.g. bg-[#F5F1EB] → #F5F1EB */
function hex(twClass: string): string {
  const m = twClass.match(/#([0-9A-Fa-f]{6})/)
  return m ? `#${m[1]}` : '#888888'
}

export function previewTheme(themeId: string): PreviewColors {
  const t = getTheme(themeId)
  return {
    bg:      hex(t.background),
    fg:      hex(t.foreground),
    primary: hex(t.primary),
    accent:  hex(t.accent),
    muted:   hex(t.muted),
    border:  hex(t.border),
    card:    hex(t.card),
  }
}
