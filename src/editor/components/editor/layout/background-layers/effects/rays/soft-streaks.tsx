import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

const STREAKS = [
  { left: '10%', width: '8vw',  angle: -20, opacityDark: 0.03, opacityLight: 0.15 },
  { left: '25%', width: '12vw', angle: -18, opacityDark: 0.04, opacityLight: 0.20 },
  { left: '45%', width: '6vw',  angle: -22, opacityDark: 0.02, opacityLight: 0.10 },
  { left: '60%', width: '10vw', angle: -16, opacityDark: 0.03, opacityLight: 0.18 },
  { left: '80%', width: '5vw',  angle: -24, opacityDark: 0.02, opacityLight: 0.08 },
]

function SoftStreaks({ isDark, secondaryColor }: { isDark: boolean } & EffectColors) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
    >
      {STREAKS.map((streak, i) => {
        const opacity = isDark ? streak.opacityDark : streak.opacityLight
        return (
          <div
            key={i}
            className="absolute"
            style={{
              width: streak.width,
              height: '150%',
              top: '-25%',
              left: streak.left,
              background: `linear-gradient(180deg,
                transparent 0%,
                ${withAlpha(secondaryColor, opacity)} 20%,
                ${withAlpha(secondaryColor, opacity * 1.2)} 50%,
                transparent 85%)`,
              transform: `rotate(${streak.angle}deg)`,
              transformOrigin: 'top center',
              filter: `blur(${20 + i * 5}px)`,
            }}
          />
        )
      })}
    </div>
  )
}

export const softStreaks: LayerEffectDef<'soft-streaks'> = {
  id: 'soft-streaks',
  label: 'Streaks',
  Component: SoftStreaks,
}
