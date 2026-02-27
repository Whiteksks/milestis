import type { LayerEffectDef, EffectColors } from '../../types'

// 160×90 viewBox (16:9). preserveAspectRatio="xMidYMid slice" to maintain shape at any size.
const CURVES: Array<{
  d: string
  op: number
  w: number
  color: 'subtle' | 'secondary'
}> = [
  // Bottom-left flowing arcs (3 layered, slightly different paths)
  { d: 'M -5 76 C 18 58, 40 84, 62 66 S 96 40, 168 54',  op: 0.80, w: 0.40, color: 'subtle'    },
  { d: 'M -5 83 C 22 66, 46 90, 64 75 S 98 48, 168 62',  op: 0.48, w: 0.24, color: 'subtle'    },
  { d: 'M -5 70 C 14 52, 32 80, 55 60 S 88 34, 168 46',  op: 0.32, w: 0.18, color: 'secondary' },
  // Top-right arcs
  { d: 'M 95 -2 C 115 10, 148 6, 162 22',               op: 0.45, w: 0.34, color: 'subtle'    },
  { d: 'M 108 -2 C 132 8, 158 10, 164 30',              op: 0.28, w: 0.20, color: 'subtle'    },
  // Single accent arc mid-right
  { d: 'M 140 20 C 148 35, 155 50, 145 65',             op: 0.22, w: 0.18, color: 'secondary' },
]

function FlowingCurves({ isDark, subtleColor, secondaryColor }: { isDark: boolean } & EffectColors) {
  const baseOp = isDark ? 0.65 : 1.0
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {CURVES.map((curve, i) => (
        <path
          key={i}
          d={curve.d}
          stroke={curve.color === 'subtle' ? subtleColor : secondaryColor}
          strokeWidth={curve.w}
          opacity={curve.op * baseOp}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

export const flowingCurves: LayerEffectDef<'flowing-curves'> = {
  id: 'flowing-curves',
  label: 'Curves',
  Component: FlowingCurves,
}
