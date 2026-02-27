import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'


/**
 * Soft, large, colour-tinted blobs floating behind content.
 * Inspired by Linear / Vercel's "premium glow" aesthetic.
 * Five blobs at different positions and scales create an
 * organic, almost gaseous atmosphere.  Each blob uses a
 * different palette token for richness.
 */

const BLOBS = [
  // Large primary -- upper-left
  { x: '-5%',  y: '-8%',  size: '45vw', blur: 90,  token: 'primary'   as const, opDark: 0.10, opLight: 0.18 },
  // Secondary -- bottom-right
  { x: '65%',  y: '60%',  size: '40vw', blur: 85,  token: 'secondary' as const, opDark: 0.08, opLight: 0.15 },
  // Accent2 -- center-right, smaller
  { x: '55%',  y: '20%',  size: '28vw', blur: 70,  token: 'accent2'   as const, opDark: 0.06, opLight: 0.12 },
  // Primary again -- bottom-left, medium
  { x: '5%',   y: '70%',  size: '30vw', blur: 75,  token: 'primary'   as const, opDark: 0.05, opLight: 0.10 },
  // Highlight -- top-center, very subtle
  { x: '35%',  y: '-5%',  size: '22vw', blur: 60,  token: 'highlight' as const, opDark: 0.04, opLight: 0.10 },
]

type TokenKey = 'primary' | 'secondary' | 'accent2' | 'highlight'

function AmbientBlobs({ isDark, ...colors }: { isDark: boolean } & EffectColors) {
  const tokenMap: Record<TokenKey, string> = {
    primary: colors.primaryColor,
    secondary: colors.secondaryColor,
    accent2: colors.accent2Color,
    highlight: colors.highlightColor,
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {BLOBS.map((blob, i) => {
        const color = tokenMap[blob.token]
        const op = isDark ? blob.opDark : blob.opLight

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: blob.size,
              height: blob.size,
              left: blob.x,
              top: blob.y,
              background: `radial-gradient(
                circle,
                ${withAlpha(color, op)} 0%,
                ${withAlpha(color, op * 0.5)} 35%,
                transparent 70%
              )`,
              filter: `blur(${blob.blur}px)`,
            }}
          />
        )
      })}

      {/* Connecting haze between blobs for continuity */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            145deg,
            ${withAlpha(colors.primaryColor, isDark ? 0.02 : 0.04)} 0%,
            transparent 40%,
            ${withAlpha(colors.secondaryColor, isDark ? 0.015 : 0.03)} 70%,
            transparent 100%
          )`,
          filter: 'blur(60px)',
        }}
      />
    </div>
  )
}

export const ambientBlobs: LayerEffectDef<'ambient-blobs'> = {
  id: 'ambient-blobs',
  label: 'Ambient Blobs',
  Component: AmbientBlobs,
}
