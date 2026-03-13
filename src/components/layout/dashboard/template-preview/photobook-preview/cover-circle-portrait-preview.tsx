/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'
import { previewTheme } from '../theme-extract'

interface CoverCirclePortraitPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
}

export function CoverCirclePortraitPreview({ themeId, title, subtitle, heroImageUrl }: CoverCirclePortraitPreviewProps) {
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
          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${c.fg} 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center px-8 py-20 text-center">
            {/* Circle portrait */}
            <div className="relative mb-12">
              <div
                className="absolute -inset-4 rounded-full border"
                style={{ borderColor: c.border }}
              />
              <div
                className="absolute -inset-8 rounded-full border opacity-30"
                style={{ borderColor: c.border }}
              />
              <div className="h-64 w-64 @md:h-80 @md:w-80 overflow-hidden rounded-full shadow-2xl ring-4 ring-white">
                {heroImageUrl
                  ? <img src={heroImageUrl} alt="" className="h-full w-full object-cover" />
                  : <div className="h-full w-full" style={{ backgroundColor: c.muted }} />}
              </div>

              {/* Small accent dot */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center"
              >
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.accent }} />
              </div>
            </div>

            {/* Title */}
            <h1
              className={cn('text-4xl @md:text-5xl @lg:text-6xl tracking-tight leading-tight', theme.fontTitle)}
              style={{ color: c.fg }}
            >
              {title || 'Our Story'}
            </h1>

            {/* Flourish */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px w-12" style={{ backgroundColor: c.border }} />
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.fg, opacity: 0.4 }} />
              <div className="h-px w-12" style={{ backgroundColor: c.border }} />
            </div>

            {/* Subtitle */}
            <p
              className={cn('max-w-sm text-lg @md:text-xl font-light italic leading-relaxed', theme.fontBody)}
              style={{ color: c.fg, opacity: 0.6 }}
            >
              {subtitle || ''}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
