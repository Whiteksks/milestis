"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'

const passthroughLoader: ImageLoader = ({ src }) => src

interface StoryLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryLumiere({ sectionContent, theme }: StoryLumiereProps) {
  const { story } = sectionContent
  const moments = story.images ?? []
  const paragraphs = story.paragraphs ?? []

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
          const aspectClass = getAspectRatioClass(block.imageSettings?.[0]?.aspectRatio)
          const paragraph = paragraphs[index] ?? ''

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
                      <div className={cn('relative overflow-hidden', aspectClass ?? 'aspect-[4/3]')}>
                        <Image
                          loader={passthroughLoader}
                          unoptimized
                          src={imageUrl}
                          alt={block.label ?? story.title ?? 'Story'}
                          fill
                          sizes="(max-width: 768px) 95vw, 60vw"
                          className="object-cover"
                        />
                      </div>
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
              {paragraph && (
                <p
                  className={cn(
                    'text-sm font-light opacity-60 leading-relaxed text-center max-w-prose',
                    theme.fontBody,
                    theme.lineHeight,
                  )}
                >
                  {paragraph}
                </p>
              )}
            </motion.div>
          )
        })}

        {/* Standalone paragraphs when no moments */}
        {moments.length === 0 && paragraphs.length > 0 && (
          <div className="space-y-5 text-center max-w-prose mx-auto">
            {paragraphs.map((para: string, i: number) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className={cn('text-sm font-light opacity-60 leading-relaxed', theme.fontBody, theme.lineHeight)}
              >
                {para}
              </motion.p>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
