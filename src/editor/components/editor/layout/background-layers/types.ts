import type React from 'react'

export interface EffectColors {
  primaryColor: string    // Main blob / glow
  secondaryColor: string  // Second blob / secondary glow
  rayColor: string        // Rays, streaks, highlights — light, diluted
  subtleColor: string     // Grid, dots, noise-tint — quietest
  highlightColor: string  // Near-white point highlight / lens flare
  shadowColor: string     // Deep shadow tint (vignette, edges)
  accent2Color: string    // Second accent for gradient/aurora effects
}

/** Convert a hex color + 0-1 opacity into an 8-digit hex string (#RRGGBBAA). */
export function withAlpha(hex: string, opacity: number): string {
  const alpha = Math.round(Math.min(Math.max(opacity, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex}${alpha}`
}

export interface LayerEffectDef<TId extends string = string> {
  id: TId
  label: string
  Component: React.ComponentType<{ isDark: boolean } & EffectColors>
}
