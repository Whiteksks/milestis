import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

/**
 * A rich, multi-layered radial glow emanating from the upper-left
 * quadrant.  Uses three nested ellipses at different scales and
 * opacity to create a sense of luminous depth -- like a warm lamp
 * glowing behind frosted glass.
 */
function RadialGlow({
  isDark,
  primaryColor,
  secondaryColor,
  highlightColor,
  shadowColor,
}: { isDark: boolean } & EffectColors) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Outermost halo -- widest reach, lowest intensity */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 80% 70% at 30% 35%,
            ${withAlpha(primaryColor, isDark ? 0.07 : 0.14)} 0%,
            ${withAlpha(primaryColor, isDark ? 0.03 : 0.06)} 40%,
            transparent 70%
          )`,
        }}
      />

      {/* Middle layer -- tighter, warmer */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 50% 45% at 28% 32%,
            ${withAlpha(secondaryColor, isDark ? 0.09 : 0.16)} 0%,
            ${withAlpha(secondaryColor, isDark ? 0.04 : 0.08)} 45%,
            transparent 75%
          )`,
        }}
      />

      {/* Core hotspot -- bright, small */}
      <div
        className="absolute"
        style={{
          width: '30vw',
          height: '30vw',
          top: '5%',
          left: '8%',
          background: `radial-gradient(
            circle,
            ${withAlpha(highlightColor, isDark ? 0.08 : 0.22)} 0%,
            ${withAlpha(highlightColor, isDark ? 0.03 : 0.08)} 40%,
            transparent 65%
          )`,
          filter: 'blur(40px)',
        }}
      />

      {/* Subtle shadow tint at bottom-right for depth contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 60% 50% at 85% 80%,
            ${withAlpha(shadowColor, isDark ? 0.08 : 0.04)} 0%,
            transparent 60%
          )`,
        }}
      />
    </div>
  )
}

export const radialGlow: LayerEffectDef<'radial-glow'> = {
  id: 'radial-glow',
  label: 'Radial Glow',
  Component: RadialGlow,
}
