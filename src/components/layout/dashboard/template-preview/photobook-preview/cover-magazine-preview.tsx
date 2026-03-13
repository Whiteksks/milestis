/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'
import { previewTheme } from '../theme-extract'

interface CoverMagazinePreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
}

export function CoverMagazinePreview({ themeId, title, subtitle, heroImageUrl }: CoverMagazinePreviewProps) {
  const theme = getTheme(themeId ?? 'parchment')
  const c = previewTheme(themeId ?? 'parchment')
  const titleWords = (title || 'Our Story').split(' ')

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
            style={{ background: 'linear-gradient(to top, rgba(20,16,12,0.6), transparent, rgba(20,16,12,0.3))' }}
          />

          <div className="absolute inset-0 flex flex-col justify-between p-8 @md:p-12">
            {/* Top: magazine header */}
            <div className="flex items-start justify-between">
              <div>
                <p
                  className={cn('text-xs uppercase tracking-[0.5em]', theme.fontBody)}
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Family Edition
                </p>
              </div>
            </div>

            {/* Center: stacked title words alternating filled/outline */}
            <div className="flex flex-1 items-center justify-start @md:justify-center">
              <div>
                {titleWords.map((word, i) => (
                  <h1
                    key={i}
                    className={cn('text-6xl @md:text-8xl @lg:text-9xl font-bold leading-[0.85] uppercase tracking-tight', theme.fontTitle)}
                    style={{
                      color: i % 2 === 1 ? 'transparent' : 'white',
                      WebkitTextStroke: i % 2 === 1 ? '1px white' : 'none',
                      WebkitTextFillColor: i % 2 === 1 ? 'transparent' : 'white',
                      textShadow: '2px 2px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {word}
                  </h1>
                ))}
              </div>
            </div>

            {/* Bottom: subtitle */}
            <div className="flex items-end justify-between">
              <p
                className={cn('max-w-xs text-lg @md:text-xl italic', theme.fontBody)}
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {subtitle || ''}
              </p>
              <div className="hidden @md:flex flex-col items-end gap-1">
                <div className="w-12 h-px bg-white/40" />
                <p
                  className={cn('text-[10px] uppercase tracking-widest', theme.fontBody)}
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Photobook
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
