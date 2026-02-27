'use client'

import { useThemeSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/themes'
import { DEPTH_EFFECTS, RAYS_EFFECTS, TEXTURE_EFFECTS, DECORATIVE_EFFECTS } from './registry'

/** placement="viewport" → renders only when backgroundScrollMode is "fixed"
 *  placement="content"  → renders only when backgroundScrollMode is "scroll" */
export function BackgroundLayers({ placement }: { placement: 'viewport' | 'content' }) {
  const { depth, rays, texture, decorative, isDark, scrollMode, primaryColor, secondaryColor, rayColor, subtleColor, highlightColor, shadowColor, accent2Color } = useThemeSelector((state) => {
    const c = state.themeCustomizations
    const themeConfig = getTheme(state.currentTheme)
    const ec = themeConfig.bgEffectColors
    return {
      depth:      c.depthEffect      ?? 'none',
      rays:       c.raysEffect       ?? 'none',
      texture:    c.textureEffect    ?? 'none',
      decorative: c.decorativeEffect ?? 'none',
      isDark:     (c.backgroundLayersTheme ?? 'dark') === 'dark',
      scrollMode: c.backgroundScrollMode ?? 'fixed',
      primaryColor:   ec.primary,
      secondaryColor: ec.secondary,
      rayColor:       ec.ray,
      subtleColor:    ec.subtle,
      highlightColor: ec.highlight,
      shadowColor:    ec.shadow,
      accent2Color:   ec.accent2,
    }
  })

  // Depth/rays/texture follow scrollMode; decoratives ALWAYS rendered in viewport
  // so they're never stretched by tall scroll-content dimensions
  const expectedPlacement = scrollMode === 'fixed' ? 'viewport' : 'content'
  const isViewport = placement === 'viewport'

  const shouldRenderLayers = placement === expectedPlacement
  const shouldRenderDecorative = isViewport && decorative !== 'none'

  if (!shouldRenderLayers && !shouldRenderDecorative) return null

  const noLayers = depth === 'none' && rays === 'none' && texture === 'none'
  if (!shouldRenderDecorative && noLayers) return null

  const activeDepth      = shouldRenderLayers ? DEPTH_EFFECTS.find((e) => e.id === depth) : undefined
  const activeRays       = shouldRenderLayers ? RAYS_EFFECTS.find((e) => e.id === rays) : undefined
  const activeTexture    = shouldRenderLayers ? TEXTURE_EFFECTS.find((e) => e.id === texture) : undefined
  const activeDecorative = shouldRenderDecorative ? DECORATIVE_EFFECTS.find((e) => e.id === decorative) : undefined

  const colors = { isDark, primaryColor, secondaryColor, rayColor, subtleColor, highlightColor, shadowColor, accent2Color }

  // In scroll mode, the decorative viewport layer must sit above the scroll container (z-10).
  // In fixed mode, z-0 is correct (the background IS the viewport div).
  const decorativeOnTop = !shouldRenderLayers && shouldRenderDecorative
  const wrapperZ = decorativeOnTop ? 'z-20' : 'z-0'

  return (
    <div className={`pointer-events-none absolute inset-0 ${wrapperZ} overflow-hidden`} aria-hidden="true">
      {activeDepth      && <activeDepth.Component      {...colors} />}
      {activeRays       && <activeRays.Component       {...colors} />}
      {activeTexture    && <activeTexture.Component    {...colors} />}
      {activeDecorative && <activeDecorative.Component {...colors} />}
    </div>
  )
}
