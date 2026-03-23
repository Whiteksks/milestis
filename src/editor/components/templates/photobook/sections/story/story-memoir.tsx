"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface StoryMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryMemoir({ sectionContent, theme }: StoryMemoirProps) {
  const { story } = sectionContent
  const moments = story.images ?? []
  const paragraphs = story.paragraphs ?? []

  return (
    <section className={cn('@container py-20 @md:py-28', theme.muted, theme.foreground)}>
      <div className="max-w-7xl mx-auto px-8 @md:px-12 @lg:px-20">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-20 @md:mb-28"
        >
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
        </motion.div>

        {/* Story moments — alternating image / text */}
        {moments.length > 0 && (
          <div className="space-y-24 @md:space-y-32">
            {moments.map((block, index) => {
              const isEven = index % 2 === 0
              const imageUrl = block.image
              const aspectRatio = block.imageSettings?.[0]?.aspectRatio ?? 'landscape'
              const frameStyle = block.imageSettings?.[0]?.frameStyle ?? 'none'
              const paragraph = paragraphs[index] ?? block.caption ?? ''

              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8 }}
                  className="grid grid-cols-1 @md:grid-cols-2 gap-10 @md:gap-16 items-center"
                >
                  {/* Photo */}
                  <div className={cn(isEven ? '@md:order-1' : '@md:order-2')}>
                    {imageUrl && (
                      <div
                        className={cn(
                          'relative overflow-hidden',
                          getAspectRatioClass(aspectRatio),
                          getFrameStyle(frameStyle),
                          theme.shadow,
                        )}
                      >
                        <Image
                          loader={passthroughLoader}
                          unoptimized
                          src={imageUrl}
                          alt={block.label ?? story.title ?? 'Story'}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
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
                    {paragraph && (
                      <p
                        className={cn(
                          'text-sm @md:text-base font-light opacity-65',
                          theme.lineHeight,
                          theme.fontBody,
                        )}
                      >
                        {paragraph}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {moments.length === 0 && !paragraphs.length && (
          <p className={cn('text-sm opacity-25 italic', theme.fontBody)}>Your story moments appear here.</p>
        )}
      </div>
    </section>
  )
}
