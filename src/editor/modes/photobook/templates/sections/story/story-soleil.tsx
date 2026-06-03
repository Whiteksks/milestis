'use client'

import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { findPhotobookRepeatingImage, SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'
import { ProjectPlaceholder } from '@/editor/components/templates/primitives/project-placeholder'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'
import { SectionLabel } from '@/editor/components/templates/primitives/section-label'
import { usePhotobookSectionNum } from '@/editor/hooks/usePhotobookSectionNum'

interface StorySoleilProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function StorySoleil({ sectionContent, theme, imageContent }: StorySoleilProps) {
  const { story } = sectionContent
  const num = usePhotobookSectionNum('story')
  const moments = story.moments ?? []

  return (
    <SectionWrapper
      id="story"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
    >
      <div className="max-w-7xl mx-auto px-8 @md:px-14 @lg:px-20 py-20 @md:py-28">
      {story.label && (
        <SectionLabel num={num} label={story.label} theme={theme} variant="rule-label" className="mb-12 @md:mb-16" />
      )}

      {/* Story meta */}
      {(story.title || story.date || story.location) && (
        <Animate className="mb-14 @md:mb-20 space-y-3">
          {story.title && (
            <h2
              className={cn(
                'text-2xl @md:text-4xl font-light tracking-tight leading-tight',
                theme.fontTitle,
              )}
            >
              {story.title}
            </h2>
          )}
          {(story.date || story.location) && (
            <p className={cn('text-[10px] uppercase tracking-[0.3em] opacity-30', theme.fontBody)}>
              {[story.date, story.location].filter(Boolean).join('  �  ')}
            </p>
          )}
        </Animate>
      )}

      {/* Moments � alternating photo / caption layout */}
      {moments.length > 0 && (
        <div className="space-y-16 @md:space-y-24">
          {moments.map((block, index) => {
            const storyImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'story', block.id) : undefined
            const isEven = index % 2 === 0

            return (
              <Animate key={block.id} direction="up" distance={24} delay={0.04}>
                <div
                  className={cn(
                    'grid grid-cols-1 @md:grid-cols-[3fr_2fr] gap-8 @md:gap-14 items-center',
                    !isEven && '@md:grid-cols-[2fr_3fr]',
                  )}
                >
                  {/* Photo */}
                  <div className={cn('overflow-hidden rounded-sm', !isEven && '@md:order-2')}>
                    {storyImage?.value.asset.src ? (
                      <SlotImage
                        slotId={storyImage.slotId}
                        value={storyImage.value}
                        alt={block.label ?? story.title ?? 'Story'}
                        sizes="(max-width: 768px) 100vw, 58vw"
                      />
                    ) : (
                      <ProjectPlaceholder seed={block.id} className="w-full aspect-[4/3]" />
                    )}
                  </div>

                  {/* Caption block */}
                  <div className={cn('space-y-4', !isEven && '@md:order-1')}>
                    <span
                      className={cn(
                        'text-[2.5rem] font-light leading-none opacity-[0.06] select-none tabular-nums',
                        theme.fontTitle,
                      )}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {block.label && (
                      <p className={cn('text-xs uppercase tracking-[0.3em] opacity-40', theme.fontBody)}>
                        {block.label}
                      </p>
                    )}
                    {block.description && (
                      <p className={cn('text-base font-light opacity-60 leading-relaxed', theme.fontBody, theme.lineHeight)}>
                        {block.description}
                      </p>
                    )}
                    {block.caption && (
                      <p className={cn('text-sm font-light opacity-55 leading-relaxed', theme.fontBody, theme.lineHeight)}>
                        {block.caption}
                      </p>
                    )}
                  </div>
                </div>
              </Animate>
            )
          })}
        </div>
      )}
      </div>
    </SectionWrapper>
  )
}

