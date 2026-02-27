import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

function ConicRays({ isDark, rayColor, highlightColor, subtleColor }: { isDark: boolean } & EffectColors) {
  const baseOp = isDark ? 0.06 : 0.18
  const glowOp = isDark ? 0.10 : 0.25

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
    >
      {/* Origin glow -- warm point where rays emanate */}
      <div
        className="absolute"
        style={{
          width: '30vw',
          height: '30vw',
          top: '-10%',
          left: '-5%',
          background: `radial-gradient(circle, ${withAlpha(highlightColor, glowOp)} 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Primary conic fan */}
      <div
        className="absolute"
        style={{
          width: '200%',
          height: '200%',
          top: '-60%',
          left: '-40%',
          background: `conic-gradient(
            from 200deg at 25% 30%,
            transparent 0deg,
            ${withAlpha(rayColor, baseOp)} 8deg,
            transparent 16deg,
            transparent 30deg,
            ${withAlpha(rayColor, baseOp * 0.7)} 36deg,
            transparent 42deg,
            transparent 58deg,
            ${withAlpha(rayColor, baseOp * 1.2)} 64deg,
            transparent 72deg,
            transparent 90deg,
            ${withAlpha(rayColor, baseOp * 0.5)} 95deg,
            transparent 100deg,
            transparent 120deg,
            ${withAlpha(rayColor, baseOp * 0.8)} 126deg,
            transparent 133deg,
            transparent 160deg
          )`,
          filter: 'blur(12px)',
        }}
      />

      {/* Secondary subtle fan -- offset for depth */}
      <div
        className="absolute"
        style={{
          width: '180%',
          height: '180%',
          top: '-50%',
          left: '-30%',
          background: `conic-gradient(
            from 210deg at 22% 28%,
            transparent 0deg,
            ${withAlpha(subtleColor, baseOp * 0.4)} 12deg,
            transparent 24deg,
            transparent 50deg,
            ${withAlpha(subtleColor, baseOp * 0.3)} 58deg,
            transparent 66deg,
            transparent 100deg,
            ${withAlpha(subtleColor, baseOp * 0.35)} 108deg,
            transparent 118deg,
            transparent 160deg
          )`,
          filter: 'blur(20px)',
        }}
      />
    </div>
  )
}

export const conicRays: LayerEffectDef<'conic-rays'> = {
  id: 'conic-rays',
  label: 'Conic Rays',
  Component: ConicRays,
}
