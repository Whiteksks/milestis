'use client'

import { useRef, useMemo } from 'react'
import { useThemeSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/themes'
import { DEPTH_EFFECTS, RAYS_EFFECTS, TEXTURE_EFFECTS } from './registry'
import { useParallaxLayer } from '@/editor/hooks/use-parallax-layer'

/**
 * Renders all background visual effects (depth, rays, texture, decorative) always in
 * the viewport div — so they fill exactly the visible area and are never stretched across
 * tall page content.
 *
 * placement="viewport" → renders effects; in scroll mode applies parallax translate
 * placement="content"  → no-op (returns null); kept for API compatibility
 */
export function BackgroundLayers({
  placement,
  scrollContainerRef,
  viewportRef,
}: {
  placement: 'viewport' | 'content'
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
  viewportRef?: React.RefObject<HTMLDivElement | null>
}) {
  const layerRef = useRef<HTMLDivElement>(null)

  // currentTheme is a primitive — no useShallow needed, stable reference
  const currentTheme = useThemeSelector((state) => state.currentTheme)
  // getTheme is pure and cheap, but called on every store update when inside a selector.
  // Moving it outside with useMemo ties the cost to theme changes only.
  const {
    primary:   primaryColor,
    secondary: secondaryColor,
    ray:       rayColor,
    subtle:    subtleColor,
    highlight: highlightColor,
    shadow:    shadowColor,
    accent2:   accent2Color,
  } = useMemo(
    () => getTheme(currentTheme).bgEffectColors,
    [currentTheme],
  )

  const { depth, rays, texture, isDark, scrollMode } = useThemeSelector((state) => {
    const c = state.themeCustomizations
    return {
      depth:      c.depthEffect            ?? 'none',
      rays:       c.raysEffect             ?? 'none',
      texture:    c.textureEffect          ?? 'none',
      isDark:     (c.backgroundLayersTheme ?? 'dark') === 'dark',
      scrollMode: c.backgroundScrollMode   ?? 'fixed',
    }
  })

  // In scroll mode, translate the layer upward as the user scrolls, creating a parallax
  // effect that makes the background visibly move relative to the content.
  // scale: 1.15 oversizes the layer by 15 % so translate never reveals empty edges.
  // strength: 0.55 uses slightly more than half of the available travel for a gentle feel.
  useParallaxLayer({
    enabled: placement === 'viewport' && scrollMode === 'scroll' && !!scrollContainerRef,
    scrollContainerRef: (scrollContainerRef ?? { current: null }) as React.RefObject<HTMLElement | null>,
    viewportRef: (viewportRef ?? { current: null }) as React.RefObject<HTMLElement | null>,
    layerRef,
    strength: 0.55,
    scale: 1.15,
  })

  // All effects live in viewport placement only — content placement is a no-op.
  if (placement === 'content') return null

  const noLayers = depth === 'none' && rays === 'none' && texture === 'none'
  if (noLayers) return null

  const activeDepth   = DEPTH_EFFECTS.find((e) => e.id === depth)
  const activeRays    = RAYS_EFFECTS.find((e) => e.id === rays)
  const activeTexture = TEXTURE_EFFECTS.find((e) => e.id === texture)

  const colors = { isDark, primaryColor, secondaryColor, rayColor, subtleColor, highlightColor, shadowColor, accent2Color }

  return (
    // origin-top: useParallaxLayer expects transform-origin at the top so the scale
    // overscan appears at the bottom and the translate never exposes an empty top edge.
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-0 origin-top overflow-hidden"
      aria-hidden="true"
    >
      {activeDepth   && <activeDepth.Component   {...colors} />}
      {activeRays    && <activeRays.Component    {...colors} />}
      {activeTexture && <activeTexture.Component {...colors} />}
    </div>
  )
}
