'use client'

import type { PhotobookImageContent } from '@/editor/image/photobook/content'
import { findPhotobookRepeatingImage, SlotImage } from '@/editor/image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { ProjectPlaceholder } from '../../../primitives/project-placeholder'
import { Animate } from '../../../primitives/animate'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface StoryMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function StoryMagazine({ sectionContent, theme, imageContent }: StoryMagazineProps) {
  const { story } = sectionContent
  const moments = story.moments ?? []

  return (
    <SectionWrapper
      id="story"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
    >
      <div className="max-w-7xl mx-auto px-8 @md:px-14 @lg:px-20 py-16 @md:py-24">

        {/* Section header */}
        <Animate trigger="mount" direction="none" className="mb-14 @md:mb-20">
          <div className="flex items-center gap-3">
            <div className={cn('h-[2px] flex-1', theme.accent)} />
            {story.label && (
              <span className={cn('text-[9px] uppercase tracking-[0.4em] opacity-35', theme.fontBody)}>
                {story.label}
              </span>
            )}
            <div className="h-px flex-1 bg-current opacity-10" />
          </div>
          {story.title && (
            <div className="mt-8 @md:mt-10 flex flex-col @md:flex-row @md:items-end justify-between gap-4">
              <h2
                className={cn(
                  'text-4xl @md:text-6xl @lg:text-7xl font-bold tracking-tighter leading-[0.88] uppercase max-w-[16ch]',
                  theme.fontTitle,
                )}
              >
                {story.title}
              </h2>
              {(story.date || story.location) && (
                <div className="flex flex-col items-start @md:items-end gap-1 shrink-0 pb-1 opacity-35">
                  {story.date && (
                    <span className={cn('text-[10px] uppercase tracking-widest', theme.fontBody)}>
                      {story.date}
                    </span>
                  )}
                  {story.location && (
                    <span className={cn('text-[10px] uppercase tracking-widest', theme.fontBody)}>
                      {story.location}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </Animate>

        {/* Story moments */}
        {moments.length > 0 && (
          <div className="space-y-20 @md:space-y-28">
            {moments.map((block, index) => {
              const storyImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'story', block.id) : undefined
              const description = block.description ?? ''

              return (
                <Animate key={block.id} direction="up" distance={32} delay={0.05}>
                  <div>
                    {storyImage?.value.asset.src ? (
                      <SlotImage
                        slotId={storyImage.slotId}
                        value={storyImage.value}
                        alt={block.label ?? story.title ?? 'Story'}
                        sizes="(max-width: 768px) 100vw, 80vw"
                      />
                    ) : (
                      <ProjectPlaceholder seed={block.id} className="w-full aspect-video" />
                    )}

                    {/* Editorial caption bar */}
                    <div className="mt-5 @md:mt-6 pt-4 border-t border-current/10 grid grid-cols-[auto_1fr] gap-5 @md:gap-10 items-start">
                      <span
                        className={cn(
                          'text-[2.5rem] @md:text-[3.5rem] font-bold leading-none opacity-[0.06] select-none tabular-nums',
                          theme.fontTitle,
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="space-y-2 pt-1">
                        {block.label && (
                          <p className={cn('text-[10px] uppercase tracking-[0.35em] opacity-45', theme.fontBody)}>
                            {block.label}
                          </p>
                        )}
                        {block.caption && (
                          <p className={cn('text-[9px] uppercase tracking-[0.2em] opacity-30', theme.fontBody)}>
                            {block.caption}
                          </p>
                        )}
                        {description && (
                          <p
                            className={cn(
                              'text-sm @md:text-base font-light opacity-55 max-w-[65ch]',
                              theme.lineHeight,
                              theme.fontBody,
                            )}
                          >
                            {description}
                          </p>
                        )}
                      </div>
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


