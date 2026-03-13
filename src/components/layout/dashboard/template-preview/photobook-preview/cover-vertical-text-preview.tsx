/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'
import { previewTheme } from '../theme-extract'

interface CoverVerticalTextPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
}

export function CoverVerticalTextPreview({ themeId, title, subtitle, heroImageUrl }: CoverVerticalTextPreviewProps) {
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
          className="@container relative h-full min-h-screen w-full overflow-hidden"
          style={{ backgroundColor: c.bg }}
        >
          {heroImageUrl && (
            <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent)' }}
          />

          <div className="relative z-10 flex h-full min-h-screen">
            {/* Vertical text column */}
            <div className="flex w-24 @md:w-32 shrink-0 items-center justify-center">
              <div className="-rotate-90 whitespace-nowrap">
                <span
                  className={cn('font-mono text-xs uppercase tracking-[0.4em]', theme.fontBody)}
                  style={{ color: heroImageUrl ? 'rgba(255,255,255,0.5)' : c.fg, opacity: 0.7 }}
                >
                  2024
                </span>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col justify-center px-8 py-20">
              <h1
                className={cn('text-6xl @md:text-8xl @lg:text-9xl leading-none tracking-tight', theme.fontTitle)}
                style={{ color: heroImageUrl ? 'white' : c.fg }}
              >
                {title || 'Title'}
              </h1>

              <div className="my-8 h-0.5 w-24" style={{ backgroundColor: c.accent }} />

              <p
                className={cn('max-w-md text-xl @md:text-2xl italic', theme.fontBody)}
                style={{ color: heroImageUrl ? 'rgba(255,255,255,0.7)' : c.fg, opacity: 0.7 }}
              >
                {subtitle || 'Subtitle'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
