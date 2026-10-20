'use client'

import { useRef, useMemo } from 'react'
import { useThemeSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/config/themes'
import { DEPTH_EFFECTS, RAYS_EFFECTS, TEXTURE_EFFECTS } from './registry'
import { useParallaxLayer } from '@/editor/hooks/use-parallax-layer'

/**
 * Renders all background visual effects (depth, rays, texture, decorative) always in
 * the viewport div — so they fill exactly the visible area and are never stretched across
 * tall page content.
 *
 * In scroll mode, applies parallax translation relative to the scroll container.
 */
export function BackgroundLayers({
  scrollContainerRef,
  viewportRef,
}: {
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
  viewportRef?: React.RefObject<HTMLDivElement | null>
}) {
  const layerRef = useRef<HTMLDivElement>(null)

  const currentTheme = useThemeSelector((state) => state.currentTheme)
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
  useParallaxLayer({
    enabled: scrollMode === 'scroll' && !!scrollContainerRef,
    scrollContainerRef: (scrollContainerRef ?? { current: null }) as React.RefObject<HTMLElement | null>,
    viewportRef: (viewportRef ?? { current: null }) as React.RefObject<HTMLElement | null>,
    layerRef,
    strength: 1.5,
    scale: 1.2,
  })

  // Skip registry lookups when all effects are disabled.
  const noLayers = depth === 'none' && rays === 'none' && texture === 'none'

  const [activeDepth, activeRays, activeTexture] = useMemo(
    () =>
      noLayers
        ? [null, null, null]
        : [
            DEPTH_EFFECTS.find((e) => e.id === depth),
            RAYS_EFFECTS.find((e) => e.id === rays),
            TEXTURE_EFFECTS.find((e) => e.id === texture),
          ],
    [noLayers, depth, rays, texture],
  )

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
