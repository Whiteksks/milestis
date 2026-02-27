import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

function Woven({ isDark, subtleColor }: { isDark: boolean } & EffectColors) {
  const op = isDark ? 0.09 : 0.16
  const line = withAlpha(subtleColor, op)
  const sz = 12  // cell size in px
  const half = sz / 2

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            to right,
            transparent 0px, transparent ${half - 1}px,
            ${line} ${half - 1}px, ${line} ${half}px,
            transparent ${half}px, transparent ${sz}px
          ),
          repeating-linear-gradient(
            to bottom,
            transparent 0px, transparent ${half - 1}px,
            ${line} ${half - 1}px, ${line} ${half}px,
            transparent ${half}px, transparent ${sz}px
          )
        `,
      }}
    />
  )
}

export const woven: LayerEffectDef<'woven'> = {
  id: 'woven',
  label: 'Woven',
  Component: Woven,
}
