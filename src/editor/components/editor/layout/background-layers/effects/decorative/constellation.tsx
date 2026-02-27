import type { LayerEffectDef, EffectColors } from '../../types'

// 160×90 viewBox (16:9). Stars are spread across the 16:9 field.
const STARS = [
  { x: 16, y: 12 }, { x: 38, y:  6 }, { x: 62, y: 18 },
  { x: 90, y:  8 }, { x: 112, y: 22 }, { x: 135, y:  9 },
  { x:  8, y: 45 }, { x: 48, y: 42 }, { x: 76, y: 52 },
  { x: 104, y: 60 }, { x: 148, y: 38 }, { x: 155, y: 60 },
  { x: 26, y: 72 }, { x: 68, y: 80 }, { x: 122, y: 78 },
]

const EDGES = [
  [0,1],[1,2],[2,3],[3,4],[4,5],
  [1,7],[2,8],[7,8],[8,9],[9,10],
  [6,7],[6,12],[12,13],[13,14],[9,14],
  [4,10],[10,11],[5,11],
]

function Constellation({ isDark, subtleColor, primaryColor }: { isDark: boolean } & EffectColors) {
  const lineOp = isDark ? 0.20 : 0.32
  const dotOp  = isDark ? 0.50 : 0.70
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={STARS[a].x} y1={STARS[a].y}
          x2={STARS[b].x} y2={STARS[b].y}
          stroke={subtleColor}
          strokeWidth="0.22"
          opacity={lineOp}
        />
      ))}
      {/* Outer glow rings on a few key stars */}
      {[0, 3, 8, 14].map((idx) => (
        <circle
          key={`ring-${idx}`}
          cx={STARS[idx].x} cy={STARS[idx].y} r="1.4"
          stroke={primaryColor}
          strokeWidth="0.18"
          opacity={dotOp * 0.40}
        />
      ))}
      {/* Star dots */}
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={s.x} cy={s.y} r="0.55"
          fill={primaryColor}
          opacity={dotOp}
        />
      ))}
    </svg>
  )
}

export const constellation: LayerEffectDef<'constellation'> = {
  id: 'constellation',
  label: 'Constellation',
  Component: Constellation,
}
