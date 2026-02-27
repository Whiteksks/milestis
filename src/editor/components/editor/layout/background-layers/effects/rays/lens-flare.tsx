import type { LayerEffectDef, EffectColors } from '../../types'
import { withAlpha } from '../../types'

const FLARES = [
  { x: '20%', y: '25%', size: 120, fade: 1.0 },
  { x: '28%', y: '30%', size: 28,  fade: 0.7 },
  { x: '38%', y: '37%', size: 56,  fade: 0.55 },
  { x: '50%', y: '44%', size: 18,  fade: 0.8 },
  { x: '62%', y: '51%', size: 72,  fade: 0.45 },
  { x: '72%', y: '57%', size: 14,  fade: 0.6 },
  { x: '80%', y: '62%', size: 38,  fade: 0.35 },
]

function LensFlare({ isDark, highlightColor }: { isDark: boolean } & EffectColors) {
  const base = isDark ? 0.10 : 0.22
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main lens body */}
      <div
        className="absolute rounded-full"
        style={{
          width: 140, height: 140,
          left: '18%', top: '23%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${withAlpha(highlightColor, base * 1.2)} 0%, ${withAlpha(highlightColor, base * 0.4)} 45%, transparent 70%)`,
          filter: 'blur(6px)',
        }}
      />
      {/* Secondary blobs along diagonal axis */}
      {FLARES.map((f, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: f.size, height: f.size,
            left: f.x, top: f.y,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${withAlpha(highlightColor, base * f.fade)} 0%, ${withAlpha(highlightColor, base * f.fade * 0.25)} 50%, transparent 72%)`,
            filter: `blur(${Math.max(1, f.size * 0.08)}px)`,
          }}
        />
      ))}
      {/* Streak line connecting flares */}
      <div
        className="absolute"
        style={{
          width: '65%', height: '1px',
          top: '44%', left: '17%',
          background: `linear-gradient(90deg,
            transparent 0%,
            ${withAlpha(highlightColor, isDark ? 0.06 : 0.18)} 25%,
            ${withAlpha(highlightColor, isDark ? 0.12 : 0.30)} 50%,
            ${withAlpha(highlightColor, isDark ? 0.06 : 0.18)} 75%,
            transparent 100%)`,
          filter: 'blur(1px)',
        }}
      />
    </div>
  )
}

export const lensFlare: LayerEffectDef<'lens-flare'> = {
  id: 'lens-flare',
  label: 'Lens Flare',
  Component: LensFlare,
}
