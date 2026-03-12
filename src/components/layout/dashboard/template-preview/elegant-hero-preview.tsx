/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'

interface ElegantHeroPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
  aspectRatio?: string
  frameStyle?: string
}

export function ElegantHeroPreview({ themeId, title, subtitle, heroImageUrl, aspectRatio, frameStyle }: ElegantHeroPreviewProps) {
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
          <div className="max-w-5xl mx-auto px-6 @md:px-10 @lg:px-16 pt-12 pb-16 @md:pb-24 text-center">
            <div className="space-y-10">
              <p className={cn('text-[10px] uppercase tracking-[0.35em] opacity-35', theme.fontBody)}>
                {subtitle || 'Portfolio'}
              </p>

              <h1 className={cn('@lg:text-[5.5rem] @md:text-7xl text-5xl font-extralight tracking-tight leading-none', theme.fontTitle)}>
                {title || 'Your Name'}
              </h1>

              <div className="w-16 h-px bg-current opacity-25 mx-auto" />

              <p className={cn('@lg:text-lg @md:text-base text-sm max-w-2xl mx-auto font-light opacity-60', theme.lineHeight, theme.fontBody)}>
                Photography that tells the story behind the frame.
              </p>

              {heroImageUrl && (
                <div className="pt-6">
                  <img
                    src={heroImageUrl}
                    alt=""
                    className="w-full object-cover"
                    style={{
                      aspectRatio: aspectRatio === 'portrait' ? '3/4' : aspectRatio === 'square' ? '1/1' : '4/3',
                      borderRadius: frameStyle === 'soft' ? '12px' : frameStyle === 'circle' ? '9999px' : '0',
                      opacity: 0, transition: 'opacity 0.3s ease 0.15s',
                    }}
                    onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
