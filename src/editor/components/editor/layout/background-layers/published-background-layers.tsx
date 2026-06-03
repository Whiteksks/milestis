'use client'

import { useMemo } from 'react'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { ThemeCustomizations } from '@/editor/lib/store/theme'
import { DEPTH_EFFECTS, RAYS_EFFECTS, TEXTURE_EFFECTS } from './registry'

interface Props {
  theme: ThemeConfig
  themeCustomizations: ThemeCustomizations
}

/**
 * Stateless version of BackgroundLayers — receives customizations as props
 * instead of reading from Zustand. Used in the published site view.
 *
 * Renders with `position: fixed` so background effects stay viewport-relative
 * as the user scrolls (matches the default "fixed" scroll mode in the editor).
 */
export function PublishedBackgroundLayers({ theme, themeCustomizations }: Props) {
  const {
    depthEffect = 'none',
    raysEffect = 'none',
    textureEffect = 'none',
    backgroundLayersTheme = 'dark',
  } = themeCustomizations

  const isDark = backgroundLayersTheme === 'dark'

  const {
    primary: primaryColor,
    secondary: secondaryColor,
    ray: rayColor,
    subtle: subtleColor,
    highlight: highlightColor,
    shadow: shadowColor,
    accent2: accent2Color,
  } = theme.bgEffectColors

  const [activeDepth, activeRays, activeTexture] = useMemo(() => {
    if (depthEffect === 'none' && raysEffect === 'none' && textureEffect === 'none') {
      return [null, null, null]
    }
    return [
      DEPTH_EFFECTS.find((e) => e.id === depthEffect) ?? null,
      RAYS_EFFECTS.find((e) => e.id === raysEffect) ?? null,
      TEXTURE_EFFECTS.find((e) => e.id === textureEffect) ?? null,
    ]
  }, [depthEffect, raysEffect, textureEffect])

  if (!activeDepth && !activeRays && !activeTexture) return null

  const colors = {
    isDark,
    primaryColor,
    secondaryColor,
    rayColor,
    subtleColor,
    highlightColor,
    shadowColor,
    accent2Color,
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {activeDepth && <activeDepth.Component {...colors} />}
      {activeRays && <activeRays.Component {...colors} />}
      {activeTexture && <activeTexture.Component {...colors} />}
    </div>
  )
}
