"use client"

import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent, PhotobookSlot } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface TimelineStoryProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function TimelineStory({ sectionContent, theme }: TimelineStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const timelineSlots = sectionContent.story.images || []

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 container mx-auto px-4 max-w-6xl space-y-10">
      {/* Story header (title, meta, paragraphs) */}
      <div className="max-w-2xl">
        {sectionContent.story.title && (
          <h3 className={cn('text-2xl md:text-3xl font-semibold mb-2', theme.fontTitle)}>
            {sectionContent.story.title}
          </h3>
        )}

        <div className="text-xs text-slate-500 flex gap-3 mb-4">
          {sectionContent.story.date && <span>{sectionContent.story.date}</span>}
          {sectionContent.story.location && <span>{sectionContent.story.location}</span>}
        </div>

        {sectionContent.story.paragraphs?.map((p, i) => (
          <p key={i} className="text-sm text-slate-700 leading-relaxed mb-2">
            {p}
          </p>
        ))}
      </div>

      {timelineSlots.length > 0 && (
        <div className="relative mt-10">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 md:translate-x-0 h-full">
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="absolute top-0 left-0 w-full bg-primary h-full origin-top"
            />
          </div>

          <div className="space-y-24 md:space-y-32">
            {timelineSlots.map((slot, index) => {
              const isEven = index % 2 === 0
              return (
                <TimelineItem
                  key={slot.id}
                  slot={slot}
                  index={index}
                  isEven={isEven}
                  theme={theme}
                />
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function TimelineItem({
  slot,
  index,
  isEven,
  theme,
}: {
  slot: PhotobookSlot
  index: number
  isEven: boolean
  theme: ThemeConfig
}) {
  const hasImages = slot.images && slot.images.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center',
        'pl-16 md:pl-0',
      )}
    >
      {/* Timeline Dot */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background z-10 shadow-[0_0_0_4px_hsl(var(--background))]">
        <div className="w-full h-full rounded-full bg-primary/50 animate-pulse" />
      </div>

      {/* Content Side */}
      <div
        className={cn(
          'space-y-4',
          isEven ? 'md:text-right md:pr-8' : 'md:order-2 md:text-left md:pl-8',
        )}
      >
        <div className="space-y-2">
          <span className="text-xs font-medium text-primary uppercase tracking-widest">
            Chapter {index + 1}
          </span>
          {slot.label && (
            <h3
              className={cn(
                'text-2xl md:text-3xl font-bold tracking-tight',
                theme.fontTitle,
              )}
            >
              {slot.label}
            </h3>
          )}
        </div>
        {slot.caption && (
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            {slot.caption}
          </p>
        )}
      </div>

      {/* Image Side */}
      <div
        className={cn(
          'relative',
          isEven ? 'md:order-2 md:pl-8' : 'md:order-1 md:pr-8',
        )}
      >
        <div
          className={cn(
            'relative rounded-2xl overflow-hidden border bg-card shadow-sm transition-all hover:shadow-md',
            'group',
          )}
        >
          {hasImages ? (
            <div
              className={cn(
                'grid gap-1',
                slot.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
              )}
            >
              {slot.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className={cn(
                    'relative overflow-hidden',
                    getAspectRatioClass(slot.imageSettings[i]?.aspectRatio || 'square'),
                    getFrameStyle(slot.imageSettings[i]?.frameStyle || 'none'),
                  )}
                >
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={img}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}
