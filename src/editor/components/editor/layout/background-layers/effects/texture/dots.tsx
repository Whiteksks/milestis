import type { LayerEffectDef, EffectColors } from '../../types'

function Dots({ isDark }: { isDark: boolean } & EffectColors) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: isDark
          ? 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)'
          : 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />
  )
}

export const dots: LayerEffectDef<'dots'> = {
  id: 'dots',
  label: 'Dots',
  Component: Dots,
}
