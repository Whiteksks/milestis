'use client'
"use client"

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface StoryMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryMemoir({ sectionContent, theme }: StoryMemoirProps) {
  const { story } = sectionContent
  const moments = story.images ?? []

  return (
    <SectionWrapper
      id="story"
      themeForeground={theme.foreground}
      className={theme.muted}
      padded={false}
      containerClassName="px-8 @md:px-12 @lg:px-20 py-20 @md:py-28"
    >

        {/* Section header */}
        <div className="mb-20 @md:mb-28">
          <div className="flex items-center gap-4 mb-6">
            <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
              Story
            </span>
            <div className="h-px flex-1 bg-current opacity-10" />
          </div>

          <div className="grid grid-cols-1 @md:grid-cols-2 gap-4 items-end">
            {story.title && (
              <h2
                className={cn(
                  'text-4xl @md:text-5xl @lg:text-6xl font-bold tracking-tighter leading-[0.9]',
                  theme.fontTitle,
                )}
              >
                {story.title}
              </h2>
            )}
            <div className="flex flex-col gap-1 @md:items-end pb-1">
              {story.date && (
                <span className={cn('text-xs uppercase opacity-40', theme.letterSpacing, theme.fontBody)}>
                  {story.date}
                </span>
              )}
              {story.location && (
                <span className={cn('text-xs uppercase opacity-40', theme.letterSpacing, theme.fontBody)}>
                  {story.location}
                </span>
              )}
            </div>
          </div>
        </div>
        {moments.length > 0 && (
          <div className="space-y-24 @md:space-y-32">
            {moments.map((block, index) => {
              const isEven = index % 2 === 0
              const imageUrl = block.image
              const aspectRatio = block.imageSettings?.[0]?.aspectRatio ?? 'wide'
              const frameStyle = block.imageSettings?.[0]?.frameStyle ?? 'none'
              const description = block.description ?? ''

              return (
                <div
                  key={block.id}
                  className="grid grid-cols-1 @md:grid-cols-2 gap-10 @md:gap-16 items-center"
                >
                  {/* Photo */}
                  <div className={cn(isEven ? '@md:order-1' : '@md:order-2')}>
                    {imageUrl && (
                      <SiteImage
                        src={imageUrl}
                        alt={block.label ?? story.title ?? 'Story'}
                        aspectRatio={aspectRatio}
                        frameStyle={frameStyle}
                        cropData={block.imageSettings?.[0]?.cropData}
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={theme.shadow}
                      />
                    )}
                    {block.caption && (
                      <p className={cn('mt-3 text-xs opacity-40', theme.fontBody)}>
                        {block.caption}
                      </p>
                    )}
                  </div>

                  {/* Text */}
                  <div
                    className={cn(
                      'flex flex-col gap-5 justify-center',
                      isEven ? '@md:order-2' : '@md:order-1',
                    )}
                  >
                    {block.label && (
                      <p className={cn('text-[10px] uppercase opacity-40', theme.letterSpacing, theme.fontBody)}>
                        {block.label}
                      </p>
                    )}
                    <div className={cn('h-px w-10', theme.accent)} />
                    {description && (
                      <p
                        className={cn(
                          'text-sm @md:text-base font-light opacity-65',
                          theme.lineHeight,
                          theme.fontBody,
                        )}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {moments.length === 0 && (
          <p className={cn('text-sm opacity-25 italic', theme.fontBody)}>Your story moments appear here.</p>
        )}
    </SectionWrapper>
  )
}
