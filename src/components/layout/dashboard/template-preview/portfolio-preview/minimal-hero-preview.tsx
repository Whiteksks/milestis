/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'

interface MinimalHeroPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
  aspectRatio?: string
  frameStyle?: string
}

export function MinimalHeroPreview({ themeId, title, subtitle, heroImageUrl, aspectRatio, frameStyle }: MinimalHeroPreviewProps) {
  const theme = getTheme(themeId ?? 'parchment')

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
          <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-16 @md:pt-24">
            {/* Top hairline */}
            <div className="w-full h-px bg-current opacity-10 mb-12" />

            <div className={cn(heroImageUrl ? 'grid @md:grid-cols-2 grid-cols-1 gap-16 @lg:gap-24 items-start' : 'max-w-3xl')}>
              <div className="space-y-10">
                {/* Section label */}
                <div className="flex items-center gap-4">
                  <span className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}>
                    {subtitle || 'Portfolio'}
                  </span>
                  <div className="h-px w-8 bg-current opacity-20" />
                </div>

                {/* Title */}
                <h1 className={cn(
                  '@lg:text-[5.5rem] @md:text-6xl text-5xl font-extralight leading-[0.92] tracking-tight',
                  theme.fontTitle,
                )}>
                  {title || 'Your Name'}
                </h1>

                {/* Description */}
                <p className={cn('@md:text-base text-sm opacity-45 font-light leading-relaxed max-w-sm', theme.fontBody)}>
                  Photography that tells the story behind the frame.
                </p>

                {/* Bottom rule + index */}
                <div className="flex items-center justify-between pt-8 border-t border-current/10">
                  <span className={cn('text-[9px] uppercase tracking-[0.35em] opacity-25', theme.fontBody)}>Scroll to explore</span>
                  <span className={cn('text-[9px] tabular-nums opacity-20', theme.fontBody)}>01</span>
                </div>
              </div>

              {heroImageUrl && (
                <img
                  src={heroImageUrl}
                  alt=""
                  className="w-full object-cover"
                  style={{
                    aspectRatio: aspectRatio === 'landscape' ? '4/3' : aspectRatio === 'square' ? '1/1' : '3/4',
                    borderRadius: frameStyle === 'soft' ? '12px' : frameStyle === 'circle' ? '9999px' : '0',
                    opacity: 0, transition: 'opacity 0.3s ease 0.15s',
                  }}
                  onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
