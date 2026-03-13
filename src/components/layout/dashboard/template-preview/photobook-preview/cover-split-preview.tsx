/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'
import { previewTheme } from '../theme-extract'

interface CoverSplitPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
}

export function CoverSplitPreview({ themeId, title, subtitle, heroImageUrl }: CoverSplitPreviewProps) {
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
        <div className="@container flex h-full min-h-screen">
          {/* Left: image */}
          <div className="relative w-1/2 overflow-hidden">
            {heroImageUrl
              ? <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              : <div className="absolute inset-0" style={{ backgroundColor: c.muted }} />}
          </div>

          {/* Right: content */}
          <div
            className="flex w-1/2 flex-col justify-center px-12 @lg:px-20"
            style={{ backgroundColor: c.bg }}
          >
            <div className="max-w-md">
              <p
                className={cn('mb-4 text-sm uppercase tracking-[0.3em]', theme.fontBody)}
                style={{ color: c.accent }}
              >
                {subtitle || '2024'}
              </p>

              <h1
                className={cn('mb-6 text-4xl @lg:text-5xl @xl:text-6xl leading-tight', theme.fontTitle)}
                style={{ color: c.fg }}
              >
                {title || 'Our Story'}
              </h1>

              <div className="mb-6 h-px w-16" style={{ backgroundColor: c.border }} />

              <p
                className={cn('mb-8 text-lg italic', theme.fontBody)}
                style={{ color: c.fg, opacity: 0.55 }}
              >
                {subtitle || 'A beautiful journey together'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
