/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'

interface BentoHeroPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
  aspectRatio?: string
  frameStyle?: string
}

export function BentoHeroPreview({ themeId, title, subtitle, heroImageUrl, aspectRatio, frameStyle }: BentoHeroPreviewProps) {
  const theme = getTheme(themeId ?? 'parchment')

  const initials = title
    ? title.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'YN'

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
          className={cn(
            '@container h-full',
            theme.background,
            theme.foreground,
          )}
        >
          <div className="@lg:px-6 @md:px-5 px-4 pt-20 @md:pt-24 pb-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid @lg:grid-cols-12 @md:grid-cols-6 grid-cols-1 gap-3">

                {/* [A] Title card */}
                <div
                  className={cn(
                    '@lg:col-span-7 @md:col-span-4 col-span-1',
                    'relative rounded-3xl border border-current/8 overflow-hidden',
                    'flex flex-col justify-between p-8 @lg:p-10 min-h-[52vh]',
                    theme.card,
                  )}
                >
                  <span
                    className={cn(
                      'self-start inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-widest',
                      'rounded-full border border-current/12 opacity-45',
                      theme.fontBody,
                    )}
                  >
                    {subtitle || 'Photographer'}
                  </span>

                  <h1 className={cn(
                    '@lg:text-[5rem] @md:text-6xl text-5xl font-bold leading-[0.92] tracking-tight',
                    theme.fontTitle,
                  )}>
                    {title || 'Your Name'}
                  </h1>

                  <div className="flex items-end justify-between gap-4 flex-wrap">
                    <p className={cn('text-xs opacity-50 leading-relaxed max-w-xs', theme.lineHeight, theme.fontBody)}>
                      Photography that tells the story behind the frame.
                    </p>
                    <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current/10 opacity-60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className={cn('text-[10px] uppercase tracking-wider', theme.fontBody)}>Open</span>
                    </div>
                  </div>
                </div>

                {/* [B] Photo card */}
                <div
                  className={cn(
                    '@lg:col-span-5 @md:col-span-2 col-span-1',
                    'relative rounded-3xl border border-current/8 overflow-hidden min-h-[52vh] flex items-center justify-center',
                    theme.card,
                  )}
                >
                  {heroImageUrl ? (
                    <img
                      src={heroImageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{
                        aspectRatio: aspectRatio === 'landscape' ? '4/3' : aspectRatio === 'square' ? '1/1' : '3/4',
                        borderRadius: frameStyle === 'soft' ? '12px' : frameStyle === 'circle' ? '9999px' : '0',
                        opacity: 0, transition: 'opacity 0.3s ease 0.15s',
                      }}
                      onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
                    />
                  ) : (
                    <span className={cn('@lg:text-8xl @md:text-6xl text-5xl font-bold opacity-[0.06] select-none', theme.fontTitle)}>
                      {initials}
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
