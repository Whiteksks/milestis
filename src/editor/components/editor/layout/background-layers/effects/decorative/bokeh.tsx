import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

// Each circle: position (vw/vh %), radius in px, opacity multiplier, which color
const BOKEH: Array<{
  x: string; y: string
  size: number
  op: number
  blur: number
  color: 'highlight' | 'primary' | 'secondary'
  ring?: boolean   // true = thin ring only, false = filled soft blob
}> = [
  // Prominent blobs
  { x: '88%', y:  '8%', size: 60,  op: 0.35, blur: 18, color: 'highlight' },
  { x: '78%', y: '18%', size: 28,  op: 0.55, blur:  8, color: 'highlight' },
  { x: '92%', y: '22%', size: 14,  op: 0.70, blur:  4, color: 'highlight', ring: true },
  { x: '10%', y: '75%', size: 80,  op: 0.20, blur: 30, color: 'primary'   },
  { x:  '5%', y: '85%', size: 35,  op: 0.30, blur: 12, color: 'primary'   },
  // Smaller accents
  { x: '55%', y:  '3%', size: 16,  op: 0.45, blur:  5, color: 'secondary' },
  { x: '68%', y:  '7%', size:  8,  op: 0.60, blur:  2, color: 'highlight', ring: true },
  { x: '38%', y: '88%', size: 24,  op: 0.28, blur:  8, color: 'secondary' },
  { x: '72%', y: '82%', size: 44,  op: 0.18, blur: 16, color: 'primary'   },
  { x: '22%', y:  '8%', size: 12,  op: 0.38, blur:  4, color: 'highlight' },
  { x: '95%', y: '55%', size: 20,  op: 0.22, blur:  7, color: 'secondary' },
  // Tiny sparkles
  { x: '84%', y: '35%', size:  5,  op: 0.70, blur:  1, color: 'highlight', ring: true },
  { x: '14%', y: '55%', size:  5,  op: 0.55, blur:  1, color: 'highlight', ring: true },
  { x: '48%', y: '95%', size:  6,  op: 0.50, blur:  1, color: 'highlight', ring: true },
]

function Bokeh({ isDark, primaryColor, secondaryColor, highlightColor }: { isDark: boolean } & EffectColors) {
  const colorMap = { highlight: highlightColor, primary: primaryColor, secondary: secondaryColor }
  const baseOp = isDark ? 0.75 : 1.0
  const blendMode = isDark ? 'screen' : 'normal'

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'] }}>
      {BOKEH.map((b, i) => {
        const hex = colorMap[b.color]
        const opacity = b.op * baseOp * (isDark ? 1 : 0.55)

        if (b.ring) {
          // Thin ring — outline only
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: b.size,
                height: b.size,
                left: b.x,
                top: b.y,
                transform: 'translate(-50%, -50%)',
                border: `1px solid ${withAlpha(hex, opacity * 1.2)}`,
                filter: `blur(${b.blur}px)`,
              }}
            />
          )
        }

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              left: b.x,
              top: b.y,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle,
                ${withAlpha(hex, opacity)} 0%,
                ${withAlpha(hex, opacity * 0.45)} 45%,
                transparent 72%)`,
              filter: `blur(${b.blur}px)`,
            }}
          />
        )
      })}
    </div>
  )
}

export const bokeh: LayerEffectDef<'bokeh'> = {
  id: 'bokeh',
  label: 'Bokeh',
  Component: Bokeh,
}
