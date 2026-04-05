"use client"

import { motion } from "framer-motion"
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface StoryLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryLumiere({ sectionContent, theme }: StoryLumiereProps) {
  const { story } = sectionContent
  const moments = story.images ?? []

  return (
    <section
      className={cn(
        '@container overflow-x-hidden py-20 @md:py-28',
        theme.muted,
        theme.foreground,
      )}
    >
      <div className="max-w-3xl mx-auto px-8 @md:px-0">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-14 @md:mb-20"
        >
          <div className="h-px flex-1 bg-current opacity-10" />
          <span className={cn('text-[8px] uppercase tracking-[0.45em] opacity-25 shrink-0', theme.fontBody)}>
            03  ·  Story
          </span>
          <div className="h-px flex-1 bg-current opacity-10" />
        </motion.div>

        {/* Story meta */}
        {(story.title || story.date || story.location) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14 space-y-2"
          >
            {story.title && (
              <h2
                className={cn(
                  'text-2xl @md:text-3xl font-light italic tracking-tight',
                  theme.fontTitle,
                )}
              >
                {story.title}
              </h2>
            )}
            {(story.date || story.location) && (
              <p className={cn('text-[9px] uppercase tracking-[0.35em] opacity-25', theme.fontBody)}>
                {[story.date, story.location].filter(Boolean).join('  —  ')}
              </p>
            )}
          </motion.div>
        )}

        {/* Story moments — centered framed */}
        {moments.map((block, index) => {
          const imageUrl = block.image
          const imageSettings = block.imageSettings?.[0]
          const aspectRatio = imageSettings?.aspectRatio ?? 'square'
          const frameStyle = imageSettings?.frameStyle ?? 'none'
          const description = block.description ?? ''

          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9 }}
              className="flex flex-col items-center gap-4 mb-14"
            >
              {imageUrl && (
                <>
                  <div className="w-full max-w-md @md:max-w-xl">
                    <div className="border border-current/10 p-[3px]">
                        <SiteImage
                          src={imageUrl}
                          alt={block.label ?? story.title ?? 'Story'}
                          aspectRatio={aspectRatio}
                          frameStyle={frameStyle}
                          cropData={imageSettings?.cropData}
                          unoptimized
                          sizes="(max-width: 768px) 95vw, 60vw"
                        />
                    </div>
                  </div>
                  {(block.label || block.caption) && (
                    <div className="w-full max-w-md @md:max-w-xl flex items-start gap-4">
                      <div className="h-px flex-none w-5 bg-current opacity-10 mt-[0.45rem]" />
                      <div>
                        {block.label && (
                          <p className={cn('text-[9px] uppercase tracking-widest opacity-50 mb-0.5', theme.fontBody)}>
                            {block.label}
                          </p>
                        )}
                        {block.caption && (
                          <p className={cn('text-[9px] uppercase tracking-widest opacity-30', theme.fontBody)}>
                            {block.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
              {description && (
                <p
                  className={cn(
                    'text-sm font-light opacity-60 leading-relaxed text-center max-w-prose',
                    theme.fontBody,
                    theme.lineHeight,
                  )}
                >
                  {description}
                </p>
              )}
            </motion.div>
          )
        })}

      </div>
    </section>
  )
}
