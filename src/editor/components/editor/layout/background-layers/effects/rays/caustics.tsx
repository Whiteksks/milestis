import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

/**
 * Overlapping radial gradients that simulate light refraction
 * patterns seen underwater or through glass.  Three offset layers
 * with different scales create a convincing caustic network.
 */

const CAUSTIC_CELLS = [
  // Layer 1 -- large, slow drift
  { x: '15%', y: '20%',  w: '35vw', h: '30vw', opDark: 0.04, opLight: 0.14 },
  { x: '50%', y: '10%',  w: '40vw', h: '35vw', opDark: 0.035, opLight: 0.12 },
  { x: '75%', y: '45%',  w: '30vw', h: '25vw', opDark: 0.03,  opLight: 0.10 },
  // Layer 2 -- medium
  { x: '5%',  y: '55%',  w: '28vw', h: '24vw', opDark: 0.035, opLight: 0.11 },
  { x: '40%', y: '60%',  w: '32vw', h: '28vw', opDark: 0.04,  opLight: 0.13 },
  { x: '70%', y: '75%',  w: '25vw', h: '22vw', opDark: 0.03,  opLight: 0.09 },
  // Layer 3 -- small, detailed
  { x: '25%', y: '35%',  w: '18vw', h: '16vw', opDark: 0.05,  opLight: 0.16 },
  { x: '60%', y: '30%',  w: '20vw', h: '18vw', opDark: 0.045, opLight: 0.14 },
  { x: '85%', y: '15%',  w: '15vw', h: '14vw', opDark: 0.03,  opLight: 0.10 },
]

function Caustics({ isDark, rayColor, highlightColor, accent2Color }: { isDark: boolean } & EffectColors) {
  const colors = [rayColor, highlightColor, accent2Color]

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
    >
      {/* Network overlay -- intersecting gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, ${withAlpha(rayColor, isDark ? 0.03 : 0.08)} 0%, transparent 100%),
            radial-gradient(ellipse 50% 60% at 70% 60%, ${withAlpha(accent2Color, isDark ? 0.025 : 0.07)} 0%, transparent 100%),
            radial-gradient(ellipse 45% 55% at 50% 20%, ${withAlpha(highlightColor, isDark ? 0.02 : 0.06)} 0%, transparent 100%)
          `,
          filter: 'blur(30px)',
        }}
      />

      {/* Individual caustic cells */}
      {CAUSTIC_CELLS.map((cell, i) => {
        const op = isDark ? cell.opDark : cell.opLight
        const color = colors[i % 3]
        const rotation = (i * 37 + 15) % 360
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: cell.w,
              height: cell.h,
              left: cell.x,
              top: cell.y,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              background: `radial-gradient(
                ellipse at ${30 + (i * 13) % 40}% ${30 + (i * 17) % 40}%,
                ${withAlpha(color, op)} 0%,
                ${withAlpha(color, op * 0.4)} 35%,
                transparent 70%)`,
              filter: `blur(${15 + (i % 3) * 10}px)`,
            }}
          />
        )
      })}

      {/* Bright caustic highlights */}
      {[
        { x: '30%', y: '25%', s: '8vw' },
        { x: '65%', y: '50%', s: '6vw' },
        { x: '45%', y: '70%', s: '5vw' },
      ].map((dot, i) => (
        <div
          key={`bright-${i}`}
          className="absolute rounded-full"
          style={{
            width: dot.s,
            height: dot.s,
            left: dot.x,
            top: dot.y,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${withAlpha(highlightColor, isDark ? 0.06 : 0.20)} 0%, transparent 60%)`,
            filter: 'blur(10px)',
          }}
        />
      ))}
    </div>
  )
}

export const caustics: LayerEffectDef<'caustics'> = {
  id: 'caustics',
  label: 'Caustics',
  Component: Caustics,
}
