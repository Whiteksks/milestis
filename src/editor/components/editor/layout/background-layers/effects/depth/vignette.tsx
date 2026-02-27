import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'


/**
 * Classic photographic vignette -- darkened edges focusing
 * attention toward the center.  Three layers: a primary
 * elliptical vignette, corner darkening for stronger edges,
 * and a faint warm tint in the center for "living" feel.
 */
function Vignette({
  isDark,
  primaryColor,
  shadowColor,
  highlightColor,
}: { isDark: boolean } & EffectColors) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main elliptical vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 65% 55% at 50% 48%,
            transparent 20%,
            ${withAlpha(shadowColor, isDark ? 0.15 : 0.04)} 60%,
            ${withAlpha(shadowColor, isDark ? 0.35 : 0.08)} 85%,
            ${withAlpha(shadowColor, isDark ? 0.50 : 0.12)} 100%
          )`,
        }}
      />

      {/* Reinforced corner shadows */}
      {[
        { x: '0%', y: '0%' },
        { x: '100%', y: '0%' },
        { x: '0%', y: '100%' },
        { x: '100%', y: '100%' },
      ].map((corner, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              circle at ${corner.x} ${corner.y},
              ${withAlpha(shadowColor, isDark ? 0.20 : 0.06)} 0%,
              transparent 50%
            )`,
          }}
        />
      ))}

      {/* Subtle warm center-fill to keep it alive */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 40% 35% at 50% 48%,
            ${withAlpha(highlightColor, isDark ? 0.02 : 0.05)} 0%,
            transparent 60%
          )`,
        }}
      />

      {/* Very faint color tint on the vignette edge */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 75% 65% at 50% 50%,
            transparent 40%,
            ${withAlpha(primaryColor, isDark ? 0.04 : 0.02)} 100%
          )`,
        }}
      />
    </div>
  )
}

export const vignette: LayerEffectDef<'vignette'> = {
  id: 'vignette',
  label: 'Vignette',
  Component: Vignette,
}
