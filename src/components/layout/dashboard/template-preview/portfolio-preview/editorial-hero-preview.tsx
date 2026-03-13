/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { getTheme } from '@/editor/lib/themes'

interface EditorialHeroPreviewProps {
  themeId?: string
  title?: string
  subtitle?: string
  heroImageUrl?: string
  aspectRatio?: string
  frameStyle?: string
}

/**
 * Scaled-down static render of the Editorial hero.
 * Inner content is 3× the card size; scale(0.333) brings it back to 1×.
 * This lets @container queries see a desktop-wide container (~960px)
 * so the two-column layout renders correctly.
 */
export function EditorialHeroPreview({ themeId, title, subtitle, heroImageUrl, aspectRatio, frameStyle }: EditorialHeroPreviewProps) {
  const theme = getTheme(themeId ?? 'parchment')

  const descriptionBlock = (
    <div className="space-y-4 max-w-sm">
      <div className="w-10 h-px bg-current opacity-20" />
      <p className={cn('text-sm @md:text-base opacity-60 font-light leading-relaxed', theme.fontBody)}>
        Photography that tells the story behind the frame.
      </p>
    </div>
  )

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
            '@container relative overflow-hidden h-full flex flex-col justify-center',
            theme.background,
            theme.foreground,
          )}
        >
          <div className="flex-1 grid grid-cols-1 @md:grid-cols-2 items-stretch">

            {/* LEFT: label + title + description */}
            <div className="relative z-20 flex flex-col @lg:pl-20 @md:pl-12 pl-6 pr-6 pt-24 @md:pt-32 pb-10 @md:pb-14">

              {/* Label row */}
              <div className="flex items-center gap-5 mb-10">
                <p className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
                  {subtitle || 'Editorial'}
                </p>
                <div className="w-16 h-px bg-current opacity-10" />
                <p className={cn('text-[10px] uppercase opacity-20', theme.letterSpacing, theme.fontBody)}>
                  N°01
                </p>
              </div>

              {/* Title */}
              <h1
                className={cn(
                  'uppercase tracking-tighter leading-[0.85]',
                  '@lg:text-[5rem] @md:text-6xl text-4xl',
                  heroImageUrl ? '@lg:-mr-[65%] @md:-mr-[25%] mr-0' : 'mr-0',
                  theme.fontTitle,
                )}
              >
                {title || 'Your Name'}
              </h1>

              {/* Description — desktop only */}
              <div className="mt-auto pt-14 hidden @md:block">
                {descriptionBlock}
              </div>
            </div>

            {/* RIGHT: photo */}
            {heroImageUrl && (
              <div className="flex items-center justify-center @md:pr-10 @lg:pr-20 px-6 @md:px-0 pt-8 @md:pt-28 @lg:pt-32 pb-8 @md:pb-14">
                <img
                  src={heroImageUrl}
                  alt=""
                  className="w-full object-cover"
                  style={{ aspectRatio: aspectRatio === 'landscape' ? '4/3' : aspectRatio === 'square' ? '1/1' : '3/4',
                           borderRadius: frameStyle === 'soft' ? '12px' : frameStyle === 'circle' ? '9999px' : '0',
                           opacity: 0, transition: 'opacity 0.3s ease 0.15s' }}
                  onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
                />
              </div>
            )}
          </div>

          {/* Description — mobile only */}
          <div className="@md:hidden @lg:px-20 @md:px-12 px-6 pb-10 pt-4">
            {descriptionBlock}
          </div>

          {/* Bottom rule */}
          <div className="@lg:px-20 @md:px-12 px-6">
            <div className="border-t border-current/10" />
          </div>
        </section>
      </div>
    </div>
  )
}
