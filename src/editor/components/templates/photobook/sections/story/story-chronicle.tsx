"use client"

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface StoryChronicleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryChronicle({ sectionContent, theme }: StoryChronicleProps) {
  const { story } = sectionContent
  // ���������� �� �� ��������� ������, ��� � � StoryMemoir
  const moments = story.images ?? []

  return (
    <SectionWrapper
      id="story"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
      padded={false}
      containerClassName="px-8 @md:px-14 @lg:px-20 py-16 @md:py-24"
    >

        {/* Section header */}
        <div className="mb-16 @md:mb-20">
          <div className={cn('border-t-2', theme.border)} />
          <div className="flex items-end justify-between mt-3 gap-4">
            <div>
              <span className={cn('text-[9px] uppercase tracking-[0.3em] opacity-35', theme.fontBody)}>
                Story
              </span>
              {story.title && (
                <h2
                  className={cn(
                    'mt-4 text-3xl @md:text-5xl @lg:text-6xl font-bold tracking-tight leading-[0.9]',
                    theme.fontTitle,
                  )}
                >
                  {story.title}
                </h2>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 pb-0.5 shrink-0">
              {story.date && (
                <span className={cn('text-[10px] uppercase opacity-35', theme.letterSpacing, theme.fontBody)}>
                  {story.date}
                </span>
              )}
              {story.location && (
                <span className={cn('text-[10px] uppercase opacity-35', theme.letterSpacing, theme.fontBody)}>
                  {story.location}
                </span>
              )}
            </div>
          </div>
        </div>
        {moments.length > 0 && (
          <div className="space-y-20 @md:space-y-28">
            {moments.map((block, index) => {
              const imageUrl = block.image
              const isEven = index % 2 === 0
              const slotNum = String(index + 1).padStart(2, '0')
              const aspectRatio = block.imageSettings?.[0]?.aspectRatio ?? 'square'
              const frameStyle = block.imageSettings?.[0]?.frameStyle ?? 'none'
              const description = block.description ?? ''

              return (
                <div
                  key={block.id}
                  className="grid grid-cols-1 @md:grid-cols-[1fr_2fr] gap-6 @md:gap-10"
                >
                  {/* Number + label sidebar */}
                  <div
                    className={cn(
                      'flex @md:flex-col items-start gap-4 @md:pt-3',
                      isEven ? '@md:order-1' : '@md:order-2',
                    )}
                  >
                    <span
                      className={cn(
                        'text-[2.5rem] @md:text-[4rem] font-bold leading-none opacity-10 select-none',
                        theme.fontTitle,
                      )}
                    >
                      {slotNum}
                    </span>
                    {block.label && (
                      <p className={cn('text-[10px] uppercase tracking-widest opacity-40 @md:mt-3', theme.fontBody)}>
                        {block.label}
                      </p>
                    )}
                    {description && (
                      <p
                        className={cn(
                          'mt-4 text-sm @md:text-base font-light opacity-65 max-w-[60ch]',
                          theme.lineHeight,
                          theme.fontBody,
                        )}
                      >
                        {description}
                      </p>
                    )}
                  </div>

                  {/* Photo + Description */}
                  <div className={cn(isEven ? '@md:order-2' : '@md:order-1')}>
                    {imageUrl && (
                      <SiteImage
                        src={imageUrl}
                        alt={block.label ?? story.title ?? `Story ${index + 1}`}
                        aspectRatio={aspectRatio}
                        frameStyle={frameStyle}
                        cropData={block.imageSettings?.[0]?.cropData}
                        unoptimized
                        sizes="(max-width: 768px) 90vw, 70vw"
                        className={theme.shadow}
                      />
                    )}
                    {block.caption && (
                      <p className={cn('mt-2 text-xs opacity-40 italic', theme.fontBody)}>
                        {block.caption}
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