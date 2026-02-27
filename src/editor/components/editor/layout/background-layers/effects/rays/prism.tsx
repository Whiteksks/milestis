import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'


/**
 * Prismatic light refraction -- narrow bands of different colors
 * at slight angles, as if white light has passed through a prism.
 * Each band uses a different color from the palette to create
 * a controlled rainbow effect that still harmonizes with the theme.
 */

function Prism({
  isDark,
  primaryColor,
  secondaryColor,
  rayColor,
  highlightColor,
  accent2Color,
}: { isDark: boolean } & EffectColors) {
  const baseMult = isDark ? 1 : 2.5

  const BANDS = [
    { color: primaryColor,   angle: -28, left: '8%',  width: '3vw', blur: 14, op: 0.05 * baseMult },
    { color: accent2Color,   angle: -26, left: '14%', width: '2vw', blur: 10, op: 0.04 * baseMult },
    { color: rayColor,       angle: -30, left: '20%', width: '4vw', blur: 18, op: 0.06 * baseMult },
    { color: highlightColor, angle: -25, left: '28%', width: '2vw', blur: 8,  op: 0.05 * baseMult },
    { color: secondaryColor, angle: -32, left: '34%', width: '3vw', blur: 16, op: 0.045 * baseMult },
    { color: primaryColor,   angle: -27, left: '42%', width: '1.5vw', blur: 6, op: 0.035 * baseMult },
    { color: accent2Color,   angle: -29, left: '48%', width: '3.5vw', blur: 15, op: 0.05 * baseMult },
  ]

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
    >
      {/* Broad prismatic wash -- base layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            -30deg,
            ${withAlpha(primaryColor, isDark ? 0.02 : 0.05)} 0%,
            ${withAlpha(accent2Color, isDark ? 0.015 : 0.04)} 25%,
            transparent 50%,
            ${withAlpha(secondaryColor, isDark ? 0.015 : 0.04)} 75%,
            ${withAlpha(rayColor, isDark ? 0.02 : 0.05)} 100%)`,
          filter: 'blur(50px)',
        }}
      />

      {/* Individual color bands */}
      {BANDS.map((band, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: band.width,
            height: '180%',
            top: '-40%',
            left: band.left,
            background: `linear-gradient(180deg,
              transparent 0%,
              ${withAlpha(band.color, band.op * 0.3)} 15%,
              ${withAlpha(band.color, band.op)} 40%,
              ${withAlpha(band.color, band.op * 0.8)} 60%,
              ${withAlpha(band.color, band.op * 0.3)} 80%,
              transparent 100%)`,
            transform: `rotate(${band.angle}deg)`,
            transformOrigin: 'top center',
            filter: `blur(${band.blur}px)`,
          }}
        />
      ))}

      {/* Highlight hotspot where bands converge */}
      <div
        className="absolute"
        style={{
          width: '20vw',
          height: '20vw',
          bottom: '10%',
          left: '15%',
          background: `radial-gradient(circle,
            ${withAlpha(highlightColor, isDark ? 0.04 : 0.12)} 0%,
            transparent 70%)`,
          filter: 'blur(35px)',
        }}
      />
    </div>
  )
}

export const prism: LayerEffectDef<'prism'> = {
  id: 'prism',
  label: 'Prism',
  Component: Prism,
}
