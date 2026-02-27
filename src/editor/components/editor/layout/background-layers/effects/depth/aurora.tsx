import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

/**
 * Northern lights / aurora borealis effect.
 * Multiple overlapping gradient bands at different angles
 * create a shimmering curtain of colour. Each band uses a
 * different palette token, producing a rich, multi-hued
 * result that adapts entirely to the chosen theme.
 */

const BANDS = [
  { angle: 135, x: '20%', y: '15%',  w: '70vw', h: '45vh', blur: 80, token: 'primary'   as const, opDark: 0.10, opLight: 0.14 },
  { angle: 150, x: '40%', y: '5%',   w: '60vw', h: '55vh', blur: 90, token: 'accent2'   as const, opDark: 0.07, opLight: 0.11 },
  { angle: 120, x: '10%', y: '30%',  w: '55vw', h: '40vh', blur: 85, token: 'secondary' as const, opDark: 0.08, opLight: 0.12 },
  { angle: 140, x: '50%', y: '20%',  w: '50vw', h: '50vh', blur: 95, token: 'primary'   as const, opDark: 0.06, opLight: 0.10 },
  { angle: 160, x: '25%', y: '0%',   w: '65vw', h: '35vh', blur: 70, token: 'accent2'   as const, opDark: 0.05, opLight: 0.08 },
]

type TokenKey = 'primary' | 'secondary' | 'accent2'

function Aurora({ isDark, ...colors }: { isDark: boolean } & EffectColors) {
  const tokenMap: Record<TokenKey, string> = {
    primary: colors.primaryColor,
    secondary: colors.secondaryColor,
    accent2: colors.accent2Color,
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Aurora bands */}
      {BANDS.map((band, i) => {
        const color = tokenMap[band.token]
        const op = isDark ? band.opDark : band.opLight

        return (
          <div
            key={i}
            className="absolute"
            style={{
              width: band.w,
              height: band.h,
              left: band.x,
              top: band.y,
              transform: `translate(-50%, -50%) rotate(${band.angle}deg)`,
              background: `linear-gradient(
                0deg,
                transparent 0%,
                ${withAlpha(color, op * 0.3)} 15%,
                ${withAlpha(color, op)} 35%,
                ${withAlpha(color, op * 1.1)} 50%,
                ${withAlpha(color, op)} 65%,
                ${withAlpha(color, op * 0.3)} 85%,
                transparent 100%
              )`,
              filter: `blur(${band.blur}px)`,
              borderRadius: '50%',
            }}
          />
        )
      })}

      {/* Bright core along the main band line */}
      <div
        className="absolute"
        style={{
          width: '80vw',
          height: '2vh',
          top: '22%',
          left: '10%',
          transform: 'rotate(140deg)',
          transformOrigin: 'left center',
          background: `linear-gradient(
            90deg,
            transparent 0%,
            ${withAlpha(colors.highlightColor, isDark ? 0.06 : 0.12)} 30%,
            ${withAlpha(colors.highlightColor, isDark ? 0.08 : 0.16)} 50%,
            ${withAlpha(colors.highlightColor, isDark ? 0.06 : 0.12)} 70%,
            transparent 100%
          )`,
          filter: 'blur(15px)',
        }}
      />

      {/* Ground-level ambient tint from aurora light */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            ${withAlpha(colors.primaryColor, isDark ? 0.03 : 0.04)} 0%,
            transparent 40%,
            ${withAlpha(colors.shadowColor, isDark ? 0.05 : 0.02)} 100%
          )`,
        }}
      />
    </div>
  )
}

export const aurora: LayerEffectDef<'aurora'> = {
  id: 'aurora',
  label: 'Aurora',
  Component: Aurora,
}
