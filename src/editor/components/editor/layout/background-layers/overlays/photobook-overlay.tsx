"use client"

import type { PhotobookTexture, PhotobookMood } from '@/editor/lib/types'

// ─── Mood → CSS filter string ─────────────────────────────────────────────
//
// Cinematic colour grades applied via CSS filter on the entire template shell.
// This tones all photos and content with a unified colour cast.
//
//   warm    — Kodak Portra / golden-hour lift: warm, slightly saturated
//   golden  — Kodak Portra pushed hard: richer warmth, hue toward amber
//   cool    — Arctic / overcast: teal shift, punchy contrast
//   muted   — Bleach-bypass: desaturated + contrast boost
//   fade    — Lomo LC-A: crushed saturation, lifted blacks
//   noir    — Timeless B&W with slight contrast lift
//   vibrant — Boosted saturation and contrast, vivid colours
//   dreamy  — Lifted blacks, low contrast, soft pastel warmth
//   earthy  — Organic forest/sand tones, analog film push

export function getMoodFilter(mood: PhotobookMood): string {
  switch (mood) {
    case 'warm':    return 'sepia(0.12) saturate(1.08) brightness(1.02) hue-rotate(-4deg)'
    case 'golden':  return 'sepia(0.22) saturate(1.22) brightness(1.05) hue-rotate(-14deg) contrast(0.96)'
    case 'cool':    return 'saturate(0.92) hue-rotate(7deg) contrast(1.04) brightness(0.98)'
    case 'muted':   return 'saturate(0.65) contrast(1.08) brightness(0.98)'
    case 'fade':    return 'saturate(0.72) contrast(0.90) brightness(1.07) sepia(0.08)'
    case 'noir':    return 'saturate(0) contrast(1.14) brightness(0.96)'
    case 'vibrant': return 'saturate(1.6) contrast(1.1) brightness(1.02) hue-rotate(-2deg)'
    case 'dreamy':  return 'saturate(0.85) contrast(0.88) brightness(1.1) sepia(0.05) hue-rotate(-8deg)'
    case 'earthy':  return 'sepia(0.15) saturate(0.95) contrast(1.05) hue-rotate(15deg) brightness(0.98)'
    default:        return 'none'
  }
}

// ─── Texture → pure CSS overlays ──────────────────────────────────────────
//
// Each entry is a React.CSSProperties object applied to a full-cover absolute
// div composited over the template via mix-blend-mode.
//
// Rules:
//  • Use backgroundImage / backgroundColor separately — never the background
//    shorthand alongside backgroundAttachment (React style warning).
//  • backgroundAttachment:'fixed' pins the gradient to the viewport so it
//    frames whatever is currently visible, regardless of page scroll length.

const TEXTURES: Record<Exclude<PhotobookTexture, 'none'>, React.CSSProperties> = {
  // ── Tonal overlays ────────────────────────────────────────────────────
  vignette: {
    // Classic photographic vignette — darkened edges draw eye to centre
    backgroundImage: 'radial-gradient(ellipse 82% 78% at 50% 50%, transparent 42%, rgba(0,0,0,0.36) 100%)',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
  },
  matte: {
    // Warm diagonal wash — like lustre/matte photo paper
    backgroundImage: 'linear-gradient(135deg, rgba(230,210,185,0.38) 0%, rgba(215,200,182,0.28) 50%, rgba(205,192,175,0.36) 100%)',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    mixBlendMode: 'soft-light',
  },
  warmth: {
    // Flat uniform amber tint across the full page
    backgroundColor: 'rgba(255, 215, 140, 0.07)',
    mixBlendMode: 'multiply',
  },
  silver: {
    // Cool slate tone — pairs well with noir or moody palettes
    backgroundColor: 'rgba(190, 205, 225, 0.09)',
    mixBlendMode: 'multiply',
  },
  haze: {
    // Soft atmospheric wash — lifts exposure dreamily corner-to-corner
    backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.03) 55%, rgba(255,245,235,0.15) 100%)',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    mixBlendMode: 'screen',
  },
  parchment: {
    // Old warm paper — more "patchy" and warm than matte
    backgroundImage: [
      'linear-gradient(120deg, rgba(235,220,195,0.2) 0%, rgba(225,210,185,0.1) 40%, rgba(235,220,195,0.2) 100%)',
      'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
      'radial-gradient(circle at 80% 20%, rgba(210,190,160,0.15) 0%, transparent 50%)',
    ].join(', '),
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    mixBlendMode: 'multiply',
  },

  // ── Surface textures ──────────────────────────────────────────────────
  linen: {
    // Fine low-contrast woven grid — premium fabric / canvas feel
    backgroundImage: [
      'repeating-linear-gradient(0deg,  transparent 0px, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px)',
      'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px)',
    ].join(', '),
    backgroundColor: 'rgba(250, 248, 245, 0.03)',
    mixBlendMode: 'multiply',
  },
  canvas: {
    // Coarser woven grid + subtle brightness lift — raw canvas / textbook
    backgroundImage: [
      'repeating-linear-gradient(0deg,  transparent 0px, transparent 1px, rgba(0,0,0,0.015) 1px, rgba(0,0,0,0.015) 2px, transparent 2px, transparent 4px)',
      'repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(0,0,0,0.02)  1px, rgba(0,0,0,0.02)  2px, transparent 2px, transparent 4px)',
      'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
    ].join(', '),
    backgroundColor: 'rgba(253, 251, 248, 0.05)',
    mixBlendMode: 'multiply',
  },
  grain: {
    // Cinematic film grain via inlined SVG fractalNoise
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
    backgroundAttachment: 'fixed',
    mixBlendMode: 'overlay',
  },
  velvet: {
    // Soft light-absorbing depth — deepens blacks, adds matted richness
    backgroundImage: [
      'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.05) 100%)',
      'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.02) 100%)',
    ].join(', '),
    backgroundColor: 'rgba(20, 20, 20, 0.02)',
    mixBlendMode: 'soft-light',
  },
}

// ─── Public helper ─────────────────────────────────────────────────────────

/** Returns the inline style object for a given texture, or null for 'none'. */
export function getTextureStyle(texture: PhotobookTexture): React.CSSProperties | null {
  if (texture === 'none' || !Object.hasOwn(TEXTURES, texture)) return null
  return TEXTURES[texture]
}

// ─── Component ─────────────────────────────────────────────────────────────

interface PhotobookOverlayProps {
  texture: PhotobookTexture
}

/**
 * Absolute full-cover overlay composited on top of all photobook sections
 * via mix-blend-mode. Placed inside PhotobookTemplateShell which provides
 * the relative stacking context.
 * pointer-events-none so it never blocks user interactions.
 */
export function PhotobookTextureOverlay({ texture }: PhotobookOverlayProps) {
  if (texture === 'none') return null

  return (
    <div
      aria-hidden
      className="absolute inset-0 z-[60] pointer-events-none select-none"
      style={TEXTURES[texture]}
    />
  )
}
