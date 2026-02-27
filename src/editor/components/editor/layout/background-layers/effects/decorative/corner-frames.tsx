import type { LayerEffectDef, EffectColors } from '../../types'

// SVG-based corners in a 160×90 viewBox (16:9) — no CSS %-stretching in scroll mode.
// preserveAspectRatio="xMidYMid slice" ensures corners stay in corners at any ratio.
const ARM = 10   // arm length in viewBox units
const IN  = 3    // inset from edge
const W   = 160
const H   = 90

const CORNER_PATHS = [
  // Top-left
  `M ${IN + ARM},${IN} L ${IN},${IN} L ${IN},${IN + ARM}`,
  // Top-right
  `M ${W - IN - ARM},${IN} L ${W - IN},${IN} L ${W - IN},${IN + ARM}`,
  // Bottom-left
  `M ${IN + ARM},${H - IN} L ${IN},${H - IN} L ${IN},${H - IN - ARM}`,
  // Bottom-right
  `M ${W - IN - ARM},${H - IN} L ${W - IN},${H - IN} L ${W - IN},${H - IN - ARM}`,
]

function CornerFrames({ isDark, subtleColor }: { isDark: boolean } & EffectColors) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {CORNER_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={subtleColor}
          strokeWidth="0.55"
          strokeLinecap="square"
          opacity={isDark ? 0.35 : 0.55}
        />
      ))}
    </svg>
  )
}

export const cornerFrames: LayerEffectDef<'corner-frames'> = {
  id: 'corner-frames',
  label: 'Corners',
  Component: CornerFrames,
}
