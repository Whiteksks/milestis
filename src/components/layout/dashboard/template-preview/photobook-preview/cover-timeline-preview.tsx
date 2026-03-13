/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'
import { previewTheme } from '../theme-extract'

interface CoverTimelinePreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
}

export function CoverTimelinePreview({ themeId, title, subtitle, heroImageUrl }: CoverTimelinePreviewProps) {
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
          className="@container relative flex h-full min-h-screen flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: c.bg }}
        >
          {heroImageUrl && (
            <div className="absolute inset-0">
              <img src={heroImageUrl} alt="" className="h-full w-full object-cover" />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to bottom, ${c.bg}33, ${c.bg}99, ${c.bg})` }}
              />
            </div>
          )}

          <div className="relative z-10 mx-auto max-w-2xl space-y-8 px-4 py-16 text-center">
            {/* Badge */}
            <div
              className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider', theme.fontBody)}
              style={{ borderColor: c.border, backgroundColor: `${c.bg}80`, color: c.fg }}
            >
              Timeline Story
            </div>

            <h1
              className={cn('text-4xl @md:text-6xl @lg:text-7xl font-bold tracking-tighter drop-shadow-sm', theme.fontTitle)}
              style={{ color: c.fg }}
            >
              {title || 'Your Story Timeline'}
            </h1>

            {subtitle && (
              <p
                className={cn('mx-auto max-w-2xl text-lg @md:text-xl leading-relaxed', theme.fontBody)}
                style={{ color: c.fg, opacity: 0.65 }}
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
