/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'

interface ShowcaseHeroPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
}

export function ShowcaseHeroPreview({ themeId, title, subtitle, heroImageUrl }: ShowcaseHeroPreviewProps) {
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
            '@container relative flex flex-col overflow-hidden min-h-screen h-full',
            theme.background,
            theme.foreground,
          )}
        >
          {/* Background image */}
          {heroImageUrl && (
            <div className="absolute inset-0">
              <img
                src={heroImageUrl}
                alt=""
                className="w-full h-full object-cover object-center"
                style={{ opacity: 0, transition: 'opacity 0.3s ease 0.15s' }}
                onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.20) 100%)' }}
              />
              <div
                className="absolute inset-0 hidden @md:block"
                style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.40) 55%, transparent 100%)' }}
              />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-end @md:justify-center max-w-7xl mx-auto w-full px-6 @md:px-12 @lg:px-20 pt-28 pb-20 @md:pt-32 @md:pb-24">
            <div className="mb-5 @md:mb-8 flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]',
                  heroImageUrl ? 'text-white/60' : 'opacity-40',
                  theme.fontBody,
                )}
              >
                <span className="w-4 h-px bg-current" />
                {subtitle || 'Portfolio'}
              </span>
            </div>

            <h1
              className={cn(
                'leading-[0.88] uppercase font-black',
                '@lg:text-[6rem] @md:text-[4.5rem] text-[2.8rem]',
                heroImageUrl ? 'text-white' : '',
                theme.fontTitle,
              )}
            >
              {title || 'Your Name'}
            </h1>

            <p
              className={cn(
                'mt-5 @md:mt-8 max-w-md text-sm @md:text-base leading-relaxed font-light',
                heroImageUrl ? 'text-white/65' : 'opacity-50',
                theme.fontBody,
              )}
            >
              Photography that tells the story behind the frame.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
