'use client'

import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { ProjectPlaceholder } from '../../../primitives/project-placeholder'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface StoryLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryLumiere({ sectionContent, theme }: StoryLumiereProps) {
  const { story } = sectionContent
  const moments = story.images ?? []

  return (
    <SectionWrapper
      id="story"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
    >
      <div className="max-w-2xl mx-auto px-8 @md:px-0 py-20 @md:py-28">

        {/* Section divider */}
        <Animate trigger="mount" direction="none" className="flex items-center gap-4 mb-14 @md:mb-20">
          <div className="h-px flex-1 bg-current opacity-10" />
          {story.label
            ? <span className={cn('text-[9px] uppercase tracking-[0.5em] opacity-25 shrink-0', theme.fontBody)}>{story.label}</span>
            : <div className="w-1 h-1 rounded-full bg-current opacity-20" />}
          <div className="h-px flex-1 bg-current opacity-10" />
        </Animate>

        {/* Story meta — centered, italic */}
        {(story.title || story.date || story.location) && (
          <Animate trigger="mount" delay={0.05} distance={16} className="text-center mb-14 @md:mb-18 space-y-3">
            {story.title && (
              <h2
                className={cn(
                  'text-2xl @sm:text-3xl @md:text-4xl font-light italic tracking-tight',
                  theme.fontTitle,
                )}
              >
                {story.title}
              </h2>
            )}
            {(story.date || story.location) && (
              <p className={cn('text-[9px] uppercase tracking-[0.4em] opacity-25', theme.fontBody)}>
                {[story.location, story.date].filter(Boolean).join(' · ')}
              </p>
            )}
          </Animate>
        )}

        {/* Story moments — film-frame rhythm */}
        {moments.length > 0 && (
          <div className="space-y-16 @md:space-y-20">
            {moments.map((block, index) => {
              const imageUrl = block.image
              const imageSettings = block.imageSettings?.[0]
              const aspectRatio = imageSettings?.aspectRatio ?? 'square'
              const frameStyle = imageSettings?.frameStyle ?? 'none'
              const description = block.description ?? ''

              return (
                <Animate key={block.id} direction="up" distance={28} delay={0.04}>
                  <div className="flex flex-col items-center">

                    {/* Film-framed photo — generous width */}
                    <div className="w-full border border-current/10 p-[3px] mb-5">
                      {imageUrl ? (
                        <SiteImage
                          src={imageUrl}
                          alt={block.label ?? story.title ?? 'Story'}
                          aspectRatio={aspectRatio}
                          frameStyle={frameStyle}
                          cropData={imageSettings?.cropData}
                          unoptimized
                          sizes="(max-width: 768px) 95vw, 65vw"
                        />
                      ) : (
                        <ProjectPlaceholder seed={block.id} className="w-full aspect-square" />
                      )}
                    </div>

                    {/* Caption strip — left rule + meta */}
                    {(block.label || block.caption || description) && (
                      <div className="w-full flex items-start gap-4">
                        <div className="flex-none mt-1">
                          <span
                            className={cn(
                              'text-[9px] opacity-20 tabular-nums',
                              theme.fontBody,
                            )}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {block.label && (
                            <p className={cn('text-[9px] uppercase tracking-widest opacity-45', theme.fontBody)}>
                              {block.label}
                            </p>
                          )}
                          {block.caption && (
                            <p className={cn('text-[9px] uppercase tracking-widest opacity-28', theme.fontBody)}>
                              {block.caption}
                            </p>
                          )}
                          {description && (
                            <p
                              className={cn(
                                'text-sm font-light italic opacity-55 leading-relaxed max-w-[52ch]',
                                theme.fontBody,
                                theme.lineHeight,
                              )}
                            >
                              {description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
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
