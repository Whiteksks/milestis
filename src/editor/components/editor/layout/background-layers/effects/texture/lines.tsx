import type { LayerEffectDef, EffectColors } from '../../types'

function Lines({ isDark }: { isDark: boolean } & EffectColors) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: isDark
          ? 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.04) 59px, rgba(255,255,255,0.04) 60px)'
          : 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(0,0,0,0.04) 59px, rgba(0,0,0,0.04) 60px)',
      }}
    />
  )
}

export const lines: LayerEffectDef<'lines'> = {
  id: 'lines',
  label: 'Lines',
  Component: Lines,
}
