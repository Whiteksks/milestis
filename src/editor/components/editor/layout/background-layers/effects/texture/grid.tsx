import type { LayerEffectDef, EffectColors } from '../../types'

function Grid({ isDark }: { isDark: boolean } & EffectColors) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: isDark
          ? `repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.03) 59px, rgba(255,255,255,0.03) 60px),
             repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.03) 59px, rgba(255,255,255,0.03) 60px)`
          : `repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(0,0,0,0.03) 59px, rgba(0,0,0,0.03) 60px),
             repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(0,0,0,0.03) 59px, rgba(0,0,0,0.03) 60px)`,
      }}
    />
  )
}

export const grid: LayerEffectDef<'grid'> = {
  id: 'grid',
  label: 'Grid',
  Component: Grid,
}
