import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

const RAYS = [
  { angle: -40, width: 220, opDark: 0.05, opLight: 0.18 },
  { angle: -25, width: 180, opDark: 0.04, opLight: 0.14 },
  { angle: -10, width: 260, opDark: 0.06, opLight: 0.22 },
  { angle: 5,   width: 200, opDark: 0.045, opLight: 0.16 },
  { angle: 18,  width: 240, opDark: 0.055, opLight: 0.20 },
  { angle: 32,  width: 190, opDark: 0.04, opLight: 0.15 },
  { angle: 48,  width: 260, opDark: 0.06, opLight: 0.23 },
]

function GodRays({ isDark, rayColor, subtleColor }: { isDark: boolean } & EffectColors) {
  const originX = '50%'
  const originY = '0%' // источник света сверху

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
    >
      {RAYS.map((ray, i) => {
        const op = isDark ? ray.opDark : ray.opLight
        const color = ray.width > 220 ? rayColor : subtleColor

        return (
          <div
            key={i}
            className="absolute"
            style={{
              position: 'absolute',
              top: originY,
              left: originX,
              width: `${ray.width}px`,
              height: '180%',
              transformOrigin: 'top center',
              transform: `translate(-50%, 0) rotate(${ray.angle}deg)`,
              background: `linear-gradient(
                to bottom,
                ${withAlpha(color, op)} 0%,
                ${withAlpha(color, op * 0.7)} 20%,
                ${withAlpha(color, op * 0.4)} 45%,
                ${withAlpha(color, op * 0.15)} 70%,
                transparent 100%
              )`,
              filter: `blur(${isDark ? 60 : 45}px)`,
            }}
          />
        )
      })}

      {/* мягкое свечение источника */}
      <div
        className="absolute"
        style={{
          top: originY,
          left: originX,
          transform: 'translate(-50%, -30%)',
          width: '60%',
          height: '60%',
          background: `radial-gradient(circle at center,
            ${withAlpha(rayColor, isDark ? 0.15 : 0.25)} 0%,
            ${withAlpha(rayColor, isDark ? 0.08 : 0.15)} 30%,
            transparent 70%)`,
          filter: `blur(${isDark ? 80 : 60}px)`,
        }}
      />
    </div>
  )
}

export const godRays: LayerEffectDef<'god-rays'> = {
  id: 'god-rays',
  label: 'God Rays',
  Component: GodRays,
}