/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'

interface LiquidGlassHeroPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
}

export function LiquidGlassHeroPreview({ themeId, title, subtitle, heroImageUrl }: LiquidGlassHeroPreviewProps) {
  const theme = getTheme(themeId ?? 'obsidian')
  const { primary, secondary, accent2 } = theme.bgEffectColors

  return (
    <div className="relative h-full w-full overflow-hidden pointer-events-none select-none">
      {/* Inner div is 3× the card size, scaled back to 1× — so @container sees ~960px */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '300%',
          height: '300%',
          transform: 'scale(0.3333) translateZ(0)',
          transformOrigin: 'top left',
          willChange: 'transform',
        }}
      >
        <section
          className="@container relative min-h-screen h-full flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at 65% 35%, ${primary}50 0%, transparent 55%),
              radial-gradient(ellipse at 15% 75%, ${secondary}40 0%, transparent 55%),
              radial-gradient(ellipse at 85% 85%, ${accent2}30 0%, transparent 50%),
              #07070e`,
          }}
        >
          {/* Static background orbs */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 750, height: 750, top: '-20%', left: '-18%',
              background: `radial-gradient(circle, ${primary}55 0%, transparent 68%)`,
              filter: 'blur(90px)',
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 650, height: 650, bottom: '-18%', right: '-14%',
              background: `radial-gradient(circle, ${secondary}50 0%, transparent 68%)`,
              filter: 'blur(80px)',
            }}
          />

          {/* Hero image behind glass */}
          {heroImageUrl && (
            <div className="absolute inset-0">
              <img
                src={heroImageUrl}
                alt=""
                className="w-full h-full object-cover object-center"
                style={{ opacity: 0, transition: 'opacity 0.3s ease 0.15s' }}
                onLoad={(e) => { e.currentTarget.style.opacity = '0.2' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)' }}
              />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 @md:px-14 pt-28 pb-20 @md:py-32 flex flex-col gap-8">

            {/* Subtitle chip */}
            <div className="flex">
              <div
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px) saturate(160%)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: primary, boxShadow: `0 0 7px ${primary}` }}
                />
                <span className={cn('text-[10px] uppercase tracking-[0.3em] text-white/55', theme.fontBody)}>
                  {subtitle || 'Portfolio'}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1
              className={cn(
                'font-black uppercase leading-[0.86] tracking-tighter text-white',
                '@lg:text-[5rem] @md:text-[4rem] text-[2.5rem]',
                theme.fontTitle,
              )}
              style={{ textShadow: '0 2px 50px rgba(0,0,0,0.55)' }}
            >
              {title || 'Your Name'}
            </h1>

            {/* Glass description card */}
            <div className="relative max-w-xl">
              <div
                className="relative rounded-2xl overflow-hidden p-6 @md:p-7"
                style={{
                  background: 'rgba(255,255,255,0.065)',
                  backdropFilter: 'blur(12px) saturate(190%)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                }}
              >
                {/* Top edge highlight */}
                <div
                  className="absolute top-0 left-5 right-5 h-px pointer-events-none"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.45), transparent)' }}
                />

                <p className={cn('relative text-sm @md:text-base text-white/62 font-light leading-relaxed', theme.fontBody)}>
                  Photography that tells the story behind the frame.
                </p>

                <div className="relative mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className={cn('text-[9px] uppercase tracking-[0.3em] text-white/28', theme.fontBody)}>
                    Creative Portfolio
                  </span>
                  <div className="flex gap-2">
                    {[primary, secondary, accent2].map((c, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full opacity-65"
                        style={{ background: c, boxShadow: `0 0 8px ${c}99` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
