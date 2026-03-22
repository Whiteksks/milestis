"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

const passthroughLoader: ImageLoader = ({ src }) => src

interface StoryMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryMemoir({ sectionContent, theme }: StoryMemoirProps) {
  const { story } = sectionContent
  const slots = story.images ?? []
  const paragraphs = story.paragraphs ?? []

  return (
    <section className={cn('py-20 md:py-28', theme.muted, theme.foreground)}>
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-24">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-20 md:mb-28"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
              Story
            </span>
            <div className="h-px flex-1 bg-current opacity-10" />
          </div>

          <div className="grid md:grid-cols-2 gap-4 items-end">
            {story.title && (
              <h2
                className={cn(
                  'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.9]',
                  theme.fontTitle,
                )}
              >
                {story.title}
              </h2>
            )}
            <div className="flex flex-col gap-1 md:items-end pb-1">
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

        {/* Story slots — alternating image / text layout */}
        {slots.length > 0 ? (
          <div className="space-y-24 md:space-y-32">
            {slots.map((slot, index) => {
              const imageUrl = slot.images?.[0] ?? ''
              const isEven = index % 2 === 0
              const paragraph = paragraphs[index] ?? slot.caption ?? ''

              return (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
                >
                  {/* Photo card */}
                  <div className={cn(isEven ? 'md:order-1' : 'md:order-2')}>
                    <div
                      className={cn(
                        'overflow-hidden',
                        theme.cardStyle,
                        theme.radiusMedium,
                        theme.shadow,
                      )}
                    >
                      <div className="aspect-[4/3] relative">
                        {imageUrl ? (
                          <Image
                            loader={passthroughLoader}
                            unoptimized
                            src={imageUrl}
                            alt={slot.label ?? `Story ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 90vw, 45vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className={cn('w-full h-full', theme.background)} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Text content */}
                  <div
                    className={cn(
                      'space-y-6',
                      isEven ? 'md:order-2' : 'md:order-1',
                    )}
                  >
                    {/* Chapter number + label */}
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          'text-5xl font-bold opacity-10 tabular-nums select-none leading-none',
                          theme.fontTitle,
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {slot.label && (
                        <span
                          className={cn(
                            'text-xs uppercase opacity-50',
                            theme.letterSpacing,
                            theme.fontBody,
                          )}
                        >
                          {slot.label}
                        </span>
                      )}
                    </div>

                    {/* Accent rule */}
                    <div className={cn('h-px w-12', theme.accent)} />

                    {/* Paragraph */}
                    {paragraph && (
                      <p
                        className={cn(
                          'text-base font-light opacity-65',
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
        ) : (
          /* No slots yet — placeholder rows */
          <div className="space-y-16 opacity-30">
            {[0, 1].map(i => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className={cn('aspect-[4/3] rounded-lg', theme.background)} />
                <div className="space-y-4">
                  <div className="h-px w-16 bg-current opacity-20" />
                  <div className="h-4 w-3/4 rounded bg-current opacity-10" />
                  <div className="h-3 w-full rounded bg-current opacity-10" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
