"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface StoryMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryMagazine({ sectionContent, theme }: StoryMagazineProps) {
  const { story } = sectionContent
  const moments = story.images ?? []

  return (
    <section className={cn('@container overflow-x-hidden py-16 @md:py-24', theme.muted, theme.foreground)}>
      <div className="max-w-7xl mx-auto px-8 @md:px-14 @lg:px-20">

        {/* Magazine section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 @md:mb-24"
        >
          <div className="flex items-center justify-between">
            <div className={cn('h-[2px] flex-1', theme.accent)} />
            <span className={cn('px-5 text-[9px] uppercase tracking-[0.35em] opacity-35', theme.fontBody)}>
              Story
            </span>
            <div className="h-px flex-1 bg-current opacity-10" />
            <span className={cn('pl-5 text-[9px] opacity-20', theme.fontBody)}>p. 03</span>
          </div>

          {story.title && (
            <div className="mt-8 flex flex-col @md:flex-row @md:items-end justify-between gap-4">
              <h2
                className={cn(
                  'text-4xl @md:text-6xl @lg:text-7xl font-bold tracking-tighter leading-[0.88] uppercase max-w-[14ch]',
                  theme.fontTitle,
                )}
              >
                {story.title}
              </h2>
              <div className="flex flex-col items-start @md:items-end gap-1 opacity-35 shrink-0">
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
            </div>
          )}
        </motion.div>

        {/* Story moments */}
        {moments.length > 0 && (
          <div className="space-y-16 @md:space-y-24">
            {moments.map((block, index) => {
              const imageUrl = block.image
              const aspectRatio = block.imageSettings?.[0]?.aspectRatio ?? 'landscape'
              const frameStyle = block.imageSettings?.[0]?.frameStyle ?? 'none'
              const description = block.description ?? ''

              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.9 }}
                >
                  {imageUrl && (
                    <div
                      className={cn(
                        'relative overflow-hidden',
                        getAspectRatioClass(aspectRatio),
                        getFrameStyle(frameStyle),
                      )}
                    >
                      <Image
                        loader={passthroughLoader}
                        unoptimized
                        src={imageUrl}
                        alt={block.label ?? story.title ?? 'Story'}
                        fill
                        sizes="(max-width: 768px) 100vw, 80vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Caption row */}
                  <div className="mt-4 @md:mt-6 grid grid-cols-[auto_1fr] gap-6 @md:gap-12 items-start">
                    <span
                      className={cn(
                        'text-[2.5rem] @md:text-[3.5rem] font-bold leading-none opacity-[0.07] select-none',
                        theme.fontTitle,
                      )}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="space-y-3 pt-1">
                      {block.label && (
                        <p className={cn('text-[10px] uppercase tracking-[0.3em] opacity-40', theme.fontBody)}>
                          {block.label}
                        </p>
                      )}
                      {block.caption && (
                        <p className={cn('text-[10px] uppercase tracking-[0.3em] opacity-30', theme.fontBody)}>
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
                </motion.div>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}
