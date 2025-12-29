import type { CSSProperties } from 'react'
import type { DecorationsConfig } from './types'

export type BackgroundImageMode = 'fixed' | 'scroll' | 'parallax'

export type BackgroundPlacement = 'viewport' | 'content'

export const BACKGROUND_MODE_PRESETS: Record<
  BackgroundImageMode,
  {
    placement: BackgroundPlacement
    fit: 'cover' | 'contain'
    position: string
    parallaxStrength: number
    parallaxScale: number
  }
> = {
  scroll: {
    placement: 'content',
    fit: 'cover',
    position: 'center',
    parallaxStrength: 0,
    parallaxScale: 1,
  },
  fixed: {
    placement: 'viewport',
    fit: 'cover',
    position: 'center',
    parallaxStrength: 0,
    parallaxScale: 1,
  },
  parallax: {
    placement: 'viewport',
    fit: 'cover',
    position: 'center',
    // Use the full available overscan travel; the hook maps it across the full scroll range.
    parallaxStrength: 1,
    // Overscan so translating the layer doesn't reveal empty background.
    parallaxScale: 1.25,
  },
}

export interface BackgroundOverrides {
  customBackground?: string
  backgroundImageType?: BackgroundImageMode
  backgroundImageOpacity?: number
}

export interface ResolvedBackgroundImage {
  url: string
  mode: BackgroundImageMode
  placement: BackgroundPlacement
  opacity: number
  fit: 'cover' | 'contain'
  position: string
  parallaxStrength: number
  parallaxScale: number
}

function toCssBackgroundImageValue(input: string): string {
  const value = input.trim()
  if (!value) return 'none'

  const lower = value.toLowerCase()

  // Allow full CSS background-image expressions.
  // Examples: url(...), linear-gradient(...), var(--bg), image-set(...)
  if (
    lower.startsWith('url(') ||
    lower.startsWith('var(') ||
    lower.includes('gradient(') ||
    lower.startsWith('image-set(') ||
    lower.startsWith('cross-fade(')
  ) {
    return value
  }

  // Otherwise treat as a plain URL/path/data-url.
  const escaped = value.replace(/"/g, '\\"')
  return `url("${escaped}")`
}

function clamp01(value: number) {
  if (Number.isNaN(value)) return 0
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

export function resolveBackgroundImage(args: {
  decorations?: DecorationsConfig | null
  overrides?: BackgroundOverrides | null
}): ResolvedBackgroundImage | null {
  const decorations = args.decorations ?? undefined
  const overrides = args.overrides ?? undefined

  const url = overrides?.customBackground || decorations?.backgroundImage?.url
  if (!url) return null

  const mode: BackgroundImageMode =
    overrides?.backgroundImageType || decorations?.backgroundImage?.type || 'scroll'

  const preset = BACKGROUND_MODE_PRESETS[mode] ?? BACKGROUND_MODE_PRESETS.scroll
  const opacity = clamp01(
    overrides?.backgroundImageOpacity ?? decorations?.backgroundImage?.opacity ?? 0.15,
  )

  return {
    url,
    mode,
    placement: preset.placement,
    opacity,
    fit: preset.fit,
    position: preset.position,
    parallaxStrength: preset.parallaxStrength,
    parallaxScale: preset.parallaxScale,
  }
}

export function getBackgroundLayerProps(resolved: ResolvedBackgroundImage | null): {
  placement: BackgroundPlacement
  className: string
  style: CSSProperties
} | null {
  if (!resolved) return null

  const className = [
    'inset-0',
    'pointer-events-none',
    // Always absolute; we control scrolling by placing it either in the viewport layer
    // (non-scrolling) or inside the content layer (scrolling).
    'absolute',
    resolved.mode === 'parallax' ? 'will-change-transform' : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return {
    placement: resolved.placement,
    className,
    style: {
      backgroundImage: toCssBackgroundImageValue(resolved.url),
      backgroundSize: resolved.fit,
      backgroundPosition: resolved.position,
      opacity: resolved.opacity,
      transform:
        resolved.mode === 'parallax'
          ? `translate3d(0, 0px, 0) scale(${resolved.parallaxScale})`
          : undefined,
      // We only translate upward (negative Y) during scroll, so anchoring the scale
      // at the top gives us more usable overscan at the bottom.
      transformOrigin: resolved.mode === 'parallax' ? 'top center' : undefined,
    },
  }
}
