import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

// viewBox 160×90 (16:9) — circles specified in those units,
// preserveAspectRatio="xMidYMid slice" keeps them round at any canvas ratio.
const CIRCLES = [
  // Top-right cluster
  { cx: 147, cy:  8, r:  9, op: 0.60, fill: false },
  { cx: 153, cy: 16, r: 16, op: 0.38, fill: false },
  { cx: 140, cy:  3, r:  4, op: 0.50, fill: false },
  { cx: 155, cy:  6, r:  2, op: 0.65, fill: true  },
  // Bottom-left cluster
  { cx:  10, cy: 80, r: 20, op: 0.28, fill: false },
  { cx:   4, cy: 87, r:  9, op: 0.40, fill: false },
  { cx:  17, cy: 86, r:  4, op: 0.35, fill: true  },
  // Scattered
  { cx:  75, cy:  4, r:  5, op: 0.30, fill: false },
  { cx: 130, cy: 55, r: 11, op: 0.22, fill: false },
  { cx:  45, cy: 84, r:  7, op: 0.32, fill: false },
  { cx: 112, cy: 82, r: 14, op: 0.20, fill: false },
  { cx:   3, cy: 42, r:  6, op: 0.25, fill: false },
  { cx:  90, cy:  2, r:  3, op: 0.45, fill: true  },
]

function FloatingCircles({ isDark, subtleColor, highlightColor }: { isDark: boolean } & EffectColors) {
  const baseOp = isDark ? 0.55 : 0.85
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {CIRCLES.map((c, i) =>
        c.fill ? (
          // Solid tiny accent dots
          <circle
            key={i}
            cx={c.cx} cy={c.cy} r={c.r}
            fill={highlightColor}
            opacity={c.op * baseOp * 0.8}
          />
        ) : (
          <circle
            key={i}
            cx={c.cx} cy={c.cy} r={c.r}
            stroke={subtleColor}
            strokeWidth={c.r > 12 ? 0.30 : 0.22}
            opacity={c.op * baseOp}
          />
        )
      )}
    </svg>
  )
}

export const floatingCircles: LayerEffectDef<'floating-circles'> = {
  id: 'floating-circles',
  label: 'Circles',
  Component: FloatingCircles,
}
