import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

/**
 * Horizontal glow band across the viewport center, evoking
 * a sunset/sunrise horizon line.  The sky above is one colour
 * temperature, the ground below another, with a bright seam
 * where they meet.
 */
function Horizon({
  isDark,
  primaryColor,
  secondaryColor,
  rayColor,
  highlightColor,
  shadowColor,
  accent2Color,
}: { isDark: boolean } & EffectColors) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient -- upper half */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            ${withAlpha(accent2Color, isDark ? 0.06 : 0.08)} 0%,
            ${withAlpha(primaryColor, isDark ? 0.04 : 0.06)} 30%,
            transparent 55%
          )`,
        }}
      />

      {/* Ground gradient -- lower half */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to top,
            ${withAlpha(shadowColor, isDark ? 0.12 : 0.04)} 0%,
            ${withAlpha(secondaryColor, isDark ? 0.05 : 0.06)} 25%,
            transparent 50%
          )`,
        }}
      />

      {/* Bright horizon seam */}
      <div
        className="absolute"
        style={{
          width: '100%',
          height: '20vh',
          top: '40%',
          left: 0,
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            ${withAlpha(rayColor, isDark ? 0.05 : 0.12)} 30%,
            ${withAlpha(highlightColor, isDark ? 0.08 : 0.18)} 50%,
            ${withAlpha(rayColor, isDark ? 0.05 : 0.12)} 70%,
            transparent 100%
          )`,
          filter: 'blur(20px)',
        }}
      />

      {/* Glowing sun/source at horizon center */}
      <div
        className="absolute"
        style={{
          width: '30vw',
          height: '12vh',
          top: '42%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `radial-gradient(
            ellipse,
            ${withAlpha(highlightColor, isDark ? 0.10 : 0.22)} 0%,
            ${withAlpha(primaryColor, isDark ? 0.05 : 0.10)} 40%,
            transparent 70%
          )`,
          filter: 'blur(25px)',
        }}
      />

      {/* Wide atmospheric haze at horizon level */}
      <div
        className="absolute"
        style={{
          width: '110%',
          height: '8vh',
          top: '46%',
          left: '-5%',
          background: `linear-gradient(
            90deg,
            transparent 0%,
            ${withAlpha(primaryColor, isDark ? 0.03 : 0.06)} 20%,
            ${withAlpha(secondaryColor, isDark ? 0.04 : 0.08)} 50%,
            ${withAlpha(primaryColor, isDark ? 0.03 : 0.06)} 80%,
            transparent 100%
          )`,
          filter: 'blur(30px)',
        }}
      />
    </div>
  )
}

export const horizon: LayerEffectDef<'horizon'> = {
  id: 'horizon',
  label: 'Horizon',
  Component: Horizon,
}
