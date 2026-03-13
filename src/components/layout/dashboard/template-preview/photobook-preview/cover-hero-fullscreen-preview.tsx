/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'
import { previewTheme } from '../theme-extract'

interface CoverHeroFullscreenPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
}

export function CoverHeroFullscreenPreview({ themeId, title, subtitle, heroImageUrl }: CoverHeroFullscreenPreviewProps) {
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
          className="@container relative flex h-full min-h-screen items-center justify-center overflow-hidden"
          style={{ backgroundColor: c.bg }}
        >
          {heroImageUrl && (
            <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, ${c.bg}cc, transparent, ${c.bg}4d)` }}
          />

          <div className="relative z-10 flex max-w-2xl flex-col items-center px-8 py-20 text-center">
            <h1
              className={cn('text-5xl @md:text-6xl @lg:text-7xl tracking-tight leading-tight', theme.fontTitle)}
              style={{ color: heroImageUrl ? '#4a3a2e' : c.fg }}
            >
              {title || 'Our Story'}
            </h1>

            <div
              className="my-8 h-px w-16"
              style={{ backgroundColor: heroImageUrl ? 'rgba(100,80,60,0.6)' : c.border }}
            />

            <p
              className={cn('max-w-md text-lg @md:text-xl font-light italic leading-relaxed', theme.fontBody)}
              style={{ color: heroImageUrl ? '#6b5049' : c.fg, opacity: 0.8 }}
            >
              {subtitle || ''}
            </p>

            <div
              className="mt-12 flex flex-col items-center gap-1"
              style={{ color: heroImageUrl ? '#7a6558' : c.fg, opacity: 0.7 }}
            >
              <span className={cn('text-xs uppercase tracking-[0.25em]', theme.fontBody)}>
                2024
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
