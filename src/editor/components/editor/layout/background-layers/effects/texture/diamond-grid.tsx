import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

function DiamondGrid({ isDark, subtleColor }: { isDark: boolean } & EffectColors) {
  const op = isDark ? 0.11 : 0.20
  const line = withAlpha(subtleColor, op)
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          repeating-linear-gradient( 45deg, ${line} 0px, ${line} 1px, transparent 1px, transparent 22px),
          repeating-linear-gradient(-45deg, ${line} 0px, ${line} 1px, transparent 1px, transparent 22px)
        `,
      }}
    />
  )
}

export const diamondGrid: LayerEffectDef<'diamond-grid'> = {
  id: 'diamond-grid',
  label: 'Diamond',
  Component: DiamondGrid,
}
