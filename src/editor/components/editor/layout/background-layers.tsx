'use client'

import { useThemeSelector } from '@/editor/lib/store'

/** placement="viewport" → renders only when backgroundScrollMode is "fixed"
 *  placement="content"  → renders only when backgroundScrollMode is "scroll" */
export function BackgroundLayers({ placement }: { placement: 'viewport' | 'content' }) {
  const { depth, rays, texture, isDark, scrollMode } = useThemeSelector((state) => {
    const c = state.themeCustomizations
    return {
      depth: c.depthEffect ?? 'none',
      rays: c.raysEffect ?? 'none',
      texture: c.textureEffect ?? 'none',
      isDark: (c.backgroundLayersTheme ?? 'dark') === 'dark',
      scrollMode: c.backgroundScrollMode ?? 'fixed',
    }
  })

  // Render only when placement matches the chosen scroll mode
  const expectedPlacement = scrollMode === 'fixed' ? 'viewport' : 'content'
  if (placement !== expectedPlacement) return null

  if (depth === 'none' && rays === 'none' && texture === 'none') return null

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">

      {/* ── Layer 1: Depth ──────────────────────────────────────── */}
      {depth === 'radial-glow' && (
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(200,160,100,0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(255,220,180,0.3) 0%, transparent 70%)',
          }}
        />
      )}

      {depth === 'vignette' && (
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)'
              : 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.08) 100%)',
          }}
        />
      )}

      {depth === 'ambient-blobs' && (
        <>
          <div
            className="absolute rounded-full"
            style={{
              width: '40vw',
              height: '40vw',
              top: '-10%',
              left: '-5%',
              background: isDark
                ? 'radial-gradient(circle, rgba(200,160,100,0.1) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255,200,150,0.2) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '35vw',
              height: '35vw',
              bottom: '-10%',
              right: '-5%',
              background: isDark
                ? 'radial-gradient(circle, rgba(100,140,200,0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(180,200,240,0.2) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '25vw',
              height: '25vw',
              top: '30%',
              right: '20%',
              background: isDark
                ? 'radial-gradient(circle, rgba(180,140,180,0.06) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(220,180,220,0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </>
      )}

      {depth === 'asymmetric-light' && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? 'linear-gradient(115deg, rgba(200,180,150,0.1) 0%, rgba(200,180,150,0.04) 35%, transparent 60%)'
                : 'linear-gradient(115deg, rgba(255,250,240,0.95) 0%, rgba(255,245,230,0.6) 35%, rgba(240,235,225,0.2) 60%, transparent 80%)',
            }}
          />
          <div
            className="absolute"
            style={{
              width: '50vw',
              height: '50vh',
              top: '-10%',
              left: '-5%',
              background: isDark
                ? 'radial-gradient(ellipse at center, rgba(255,220,170,0.08) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(255,240,210,0.4) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </>
      )}

      {/* ── Layer 2: Rays ──────────────────────────────────────── */}
      {rays === 'diagonal-rays' && (
        <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
          {[18, 32, 48, 62, 76].map((offset, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: `${1 + i * 0.3}px`,
                height: '160%',
                top: '-30%',
                left: `${offset}%`,
                background: isDark
                  ? `linear-gradient(180deg, transparent 0%, rgba(255,240,210,${0.04 + i * 0.01}) 30%, rgba(255,240,210,${0.06 + i * 0.01}) 50%, transparent 80%)`
                  : `linear-gradient(180deg, transparent 0%, rgba(255,250,235,${0.3 + i * 0.05}) 30%, rgba(255,245,225,${0.4 + i * 0.05}) 50%, transparent 80%)`,
                transform: `rotate(${-25 + i * 3}deg)`,
                transformOrigin: 'top center',
                filter: `blur(${3 + i * 2}px)`,
              }}
            />
          ))}
        </div>
      )}

      {rays === 'conic-rays' && (
        <div
          className="absolute"
          style={{
            width: '120vw',
            height: '120vh',
            top: '-30%',
            left: '-20%',
            background: isDark
              ? `conic-gradient(from 200deg at 25% 35%,
                  transparent 0deg, rgba(255,240,200,0.04) 15deg, transparent 30deg,
                  transparent 40deg, rgba(255,240,200,0.03) 55deg, transparent 70deg,
                  transparent 90deg, rgba(255,240,200,0.05) 105deg, transparent 120deg,
                  transparent 140deg, rgba(255,240,200,0.02) 160deg, transparent 180deg,
                  transparent 200deg, rgba(255,240,200,0.04) 220deg, transparent 240deg,
                  transparent 280deg, rgba(255,240,200,0.03) 300deg, transparent 320deg,
                  transparent 360deg)`
              : `conic-gradient(from 200deg at 25% 35%,
                  transparent 0deg, rgba(255,240,200,0.2) 15deg, transparent 30deg,
                  transparent 40deg, rgba(255,240,200,0.15) 55deg, transparent 70deg,
                  transparent 90deg, rgba(255,240,200,0.25) 105deg, transparent 120deg,
                  transparent 140deg, rgba(255,240,200,0.1) 160deg, transparent 180deg,
                  transparent 200deg, rgba(255,240,200,0.2) 220deg, transparent 240deg,
                  transparent 280deg, rgba(255,240,200,0.15) 300deg, transparent 320deg,
                  transparent 360deg)`,
            filter: isDark ? 'blur(15px)' : 'blur(20px)',
          }}
        />
      )}

      {rays === 'soft-streaks' && (
        <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
          {[
            { left: '10%', width: '8vw', angle: -20, opacity: isDark ? 0.03 : 0.15 },
            { left: '25%', width: '12vw', angle: -18, opacity: isDark ? 0.04 : 0.2 },
            { left: '45%', width: '6vw', angle: -22, opacity: isDark ? 0.02 : 0.1 },
            { left: '60%', width: '10vw', angle: -16, opacity: isDark ? 0.03 : 0.18 },
            { left: '80%', width: '5vw', angle: -24, opacity: isDark ? 0.02 : 0.08 },
          ].map((streak, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: streak.width,
                height: '150%',
                top: '-25%',
                left: streak.left,
                background: `linear-gradient(180deg, transparent 0%, rgba(255,248,230,${streak.opacity}) 20%, rgba(255,245,220,${streak.opacity * 1.2}) 50%, transparent 85%)`,
                transform: `rotate(${streak.angle}deg)`,
                transformOrigin: 'top center',
                filter: `blur(${20 + i * 5}px)`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Layer 3: Texture ──────────────────────────────────── */}
      {texture === 'grain' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
            opacity: isDark ? 0.06 : 0.04,
            mixBlendMode: isDark ? 'overlay' : 'multiply',
          }}
        />
      )}

      {texture === 'dots' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)'
              : 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      )}

      {texture === 'lines' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.04) 59px, rgba(255,255,255,0.04) 60px)'
              : 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(0,0,0,0.04) 59px, rgba(0,0,0,0.04) 60px)',
          }}
        />
      )}

      {texture === 'grid' && (
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
      )}

    </div>
  )
}
