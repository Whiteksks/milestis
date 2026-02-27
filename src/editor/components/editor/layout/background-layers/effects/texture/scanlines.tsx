import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

function Scanlines({ isDark, subtleColor }: { isDark: boolean } & EffectColors) {
  const op = isDark ? 0.07 : 0.11
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          transparent 0px,
          transparent 1px,
          ${withAlpha(subtleColor, op)} 1px,
          ${withAlpha(subtleColor, op)} 2px
        )`,
      }}
    />
  )
}

export const scanlines: LayerEffectDef<'scanlines'> = {
  id: 'scanlines',
  label: 'Scanlines',
  Component: Scanlines,
}
