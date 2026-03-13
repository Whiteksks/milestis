/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'

interface GridHeroPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
  aspectRatio?: string
  frameStyle?: string
}

export function GridHeroPreview({ themeId, title, subtitle, heroImageUrl, aspectRatio, frameStyle }: GridHeroPreviewProps) {
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
            '@container h-full pt-20 @md:pt-24 pb-3',
            theme.background,
            theme.foreground,
          )}
        >
          <div className="max-w-7xl mx-auto px-4 @md:px-6 @lg:px-8">
            <div
              className={cn(
                'relative rounded-2xl border border-current/8',
                'p-8 @lg:p-14 min-h-[72vh] flex items-center',
                theme.card,
              )}
            >
              <div className="grid grid-cols-1 @lg:grid-cols-12 gap-10 items-center w-full relative z-10">

                {/* Left: text */}
                <div className="@lg:col-span-6 space-y-8">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-5 bg-current opacity-25" />
                      <span className={cn('text-[10px] uppercase tracking-[0.3em] opacity-50', theme.fontBody)}>
                        {subtitle || 'Photographer'}
                      </span>
                    </div>

                    <h1 className={cn(
                      'text-5xl @md:text-6xl @lg:text-7xl font-bold leading-[0.9] tracking-tight',
                      theme.fontTitle,
                    )}>
                      {title || 'Your Name'}
                    </h1>

                    <p className={cn('text-base opacity-50 leading-relaxed max-w-sm', theme.fontBody)}>
                      Photography that tells the story behind the frame.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-current/10 bg-current/[0.02]">
                    <span className="relative flex h-2 w-2">
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className={cn('text-[10px] uppercase tracking-widest opacity-55', theme.fontBody)}>
                      Open for opportunities
                    </span>
                  </div>
                </div>

                {/* Right: photo */}
                <div className="@lg:col-span-6 flex justify-center @lg:justify-end">
                  <div className="w-full">
                    {heroImageUrl ? (
                      <img
                        src={heroImageUrl}
                        alt=""
                        className="w-full object-cover"
                        style={{
                          aspectRatio: aspectRatio === 'landscape' ? '4/3' : aspectRatio === 'portrait' ? '3/4' : '1/1',
                          borderRadius: frameStyle === 'soft' ? '12px' : frameStyle === 'circle' ? '9999px' : '0',
                          opacity: 0, transition: 'opacity 0.3s ease 0.15s',
                        }}
                        onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
                      />
                    ) : (
                      <div className={cn(
                        'relative w-full overflow-hidden rounded-2xl bg-current/[0.03]',
                        'aspect-square flex items-center justify-center',
                      )}>
                        <span className={cn('text-8xl font-bold opacity-[0.06] select-none', theme.fontTitle)}>
                          {initials}
                        </span>
                      </div>
                    )}
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
