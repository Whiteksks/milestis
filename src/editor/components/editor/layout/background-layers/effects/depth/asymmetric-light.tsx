import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'


/**
 * Asymmetric lighting -- the left side is noticeably brighter
 * than the right, like natural window light falling from one
 * direction.  Inspired by the Otonoha Moe reference: warm,
 * angled illumination with a gentle gradient falloff.
 */
function AsymmetricLight({
  isDark,
  primaryColor,
  rayColor,
  highlightColor,
  shadowColor,
}: { isDark: boolean } & EffectColors) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary diagonal fill -- left bright, right dim */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            118deg,
            ${withAlpha(highlightColor, isDark ? 0.06 : 0.20)} 0%,
            ${withAlpha(rayColor, isDark ? 0.04 : 0.12)} 25%,
            ${withAlpha(rayColor, isDark ? 0.015 : 0.05)} 50%,
            transparent 70%
          )`,
        }}
      />

      {/* Upper-left warm glow source */}
      <div
        className="absolute"
        style={{
          width: '55vw',
          height: '55vh',
          top: '-12%',
          left: '-8%',
          background: `radial-gradient(
            ellipse at 40% 40%,
            ${withAlpha(highlightColor, isDark ? 0.08 : 0.25)} 0%,
            ${withAlpha(primaryColor, isDark ? 0.04 : 0.10)} 40%,
            transparent 70%
          )`,
          filter: 'blur(50px)',
        }}
      />

      {/* Secondary glow -- mid-left for continuity */}
      <div
        className="absolute"
        style={{
          width: '35vw',
          height: '40vh',
          top: '25%',
          left: '5%',
          background: `radial-gradient(
            ellipse,
            ${withAlpha(rayColor, isDark ? 0.04 : 0.10)} 0%,
            transparent 65%
          )`,
          filter: 'blur(45px)',
        }}
      />

      {/* Right-side shadow depth to increase asymmetry */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            -60deg,
            ${withAlpha(shadowColor, isDark ? 0.12 : 0.03)} 0%,
            transparent 45%
          )`,
        }}
      />

      {/* Bottom edge darkening for grounding */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to top,
            ${withAlpha(shadowColor, isDark ? 0.08 : 0.02)} 0%,
            transparent 25%
          )`,
        }}
      />
    </div>
  )
}

export const asymmetricLight: LayerEffectDef<'asymmetric-light'> = {
  id: 'asymmetric-light',
  label: 'Asymmetric Light',
  Component: AsymmetricLight,
}
