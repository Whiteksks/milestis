'use client'

import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { findPhotobookRepeatingImage, SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { ProjectPlaceholder } from '@/editor/components/templates/primitives/project-placeholder'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'

interface StoryMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function StoryMemoir({ sectionContent, theme, imageContent }: StoryMemoirProps) {
  const { story } = sectionContent
  const moments = story.moments ?? []

  return (
    <SectionWrapper
      id="story"
      themeForeground={theme.foreground}
      className={theme.muted}
    >
      <div className="max-w-7xl mx-auto px-8 @md:px-12 @lg:px-20 py-20 @md:py-28">

        {/* Section header */}
        <div className="mb-20 @md:mb-28">
          {story.label && (
            <div className="flex items-center gap-4 mb-6">
              <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
                {story.label}
              </span>
              <div className="h-px flex-1 bg-current opacity-10" />
            </div>
          )}

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
              const storyImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'story', block.id) : undefined
              const description = block.description ?? ''

              return (
                <div
                  key={block.id}
                  className="grid grid-cols-1 @md:grid-cols-2 gap-10 @md:gap-16 items-center"
                >
                  {/* Photo */}
                  <div className={cn(isEven ? '@md:order-1' : '@md:order-2')}>
                    {storyImage?.value.asset.src ? (
                      <SlotImage
                        slotId={storyImage.slotId}
                        value={storyImage.value}
                        alt={block.label ?? story.title ?? 'Story'}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <ProjectPlaceholder seed={block.id} className="w-full aspect-video" />
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

      </div>
    </SectionWrapper>
  )
}

