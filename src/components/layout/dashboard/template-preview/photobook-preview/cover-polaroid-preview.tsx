/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'
import { previewTheme } from '../theme-extract'

interface CoverPolaroidPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
}

export function CoverPolaroidPreview({ themeId, title, subtitle, heroImageUrl }: CoverPolaroidPreviewProps) {
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
        <div
          className="@container flex h-full min-h-screen flex-col items-center justify-center p-8"
          style={{ backgroundColor: c.bg }}
        >
          {/* Polaroid frame */}
          <div
            className="relative inline-block"
            style={{
              backgroundColor: c.card,
              padding: '16px 16px 64px',
              transform: 'rotate(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
            }}
          >
            <div className="h-80 w-72 @md:h-96 @md:w-80 overflow-hidden">
              {heroImageUrl
                ? <img src={heroImageUrl} alt="" className="h-full w-full object-cover" />
                : <div className="h-full w-full" style={{ backgroundColor: c.muted }} />}
            </div>

            <p
              className={cn('absolute bottom-5 left-0 right-0 text-center text-sm italic', theme.fontBody)}
              style={{ color: c.fg, opacity: 0.55 }}
            >
              2024
            </p>
          </div>

          {/* Title below polaroid */}
          <div className="mt-12 text-center">
            <h1
              className={cn('mb-3 text-4xl @lg:text-5xl', theme.fontTitle)}
              style={{ color: c.fg }}
            >
              {title || 'Our Story'}
            </h1>

            <p
              className={cn('mb-2 text-lg italic', theme.fontBody)}
              style={{ color: c.fg, opacity: 0.55 }}
            >
              {subtitle || ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
