import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

function Halftone({ isDark, subtleColor }: { isDark: boolean } & EffectColors) {
  const op = isDark ? 0.14 : 0.28
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle, ${withAlpha(subtleColor, op)} 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
        maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 75%)',
      }}
    />
  )
}

export const halftone: LayerEffectDef<'halftone'> = {
  id: 'halftone',
  label: 'Halftone',
  Component: Halftone,
}
