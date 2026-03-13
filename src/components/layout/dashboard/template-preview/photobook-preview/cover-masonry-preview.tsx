/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'
import { previewTheme } from '../theme-extract'

interface CoverMasonryPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
}

export function CoverMasonryPreview({ themeId, title, subtitle, heroImageUrl }: CoverMasonryPreviewProps) {
  const theme = getTheme(themeId ?? 'parchment')
  const c = previewTheme(themeId ?? 'parchment')

  return (
    <div className="relative h-full w-full overflow-hidden pointer-events-none select-none">
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
          className="@container relative flex h-full min-h-screen items-end overflow-hidden"
          style={{ backgroundColor: c.bg }}
        >
          {heroImageUrl && (
            <>
              <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div
                className="absolute inset-0 z-10"
                style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.3), ${c.bg}e6)` }}
              />
            </>
          )}

          <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-start gap-6 px-6 py-16">
            {/* Badge */}
            <div
              className={cn('inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-[0.65rem] uppercase tracking-[0.3em]', theme.fontBody)}
              style={{ color: heroImageUrl ? 'white' : c.fg }}
            >
              Photobook Masonry
            </div>

            <h1
              className={cn('text-4xl @md:text-6xl @lg:text-7xl font-semibold drop-shadow-2xl', theme.fontTitle)}
              style={{ color: heroImageUrl ? 'white' : c.fg }}
            >
              {title || 'Your Story'}
            </h1>

            {subtitle && (
              <p
                className={cn('max-w-xl text-lg font-light leading-relaxed', theme.fontBody)}
                style={{ color: heroImageUrl ? 'rgba(255,255,255,0.8)' : c.fg }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
