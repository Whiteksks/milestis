"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

const passthroughLoader: ImageLoader = ({ src }) => src

interface GalleryMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryMemoir({ sectionContent, theme }: GalleryMemoirProps) {
  const { gallery } = sectionContent
  const photos = gallery.images ?? []

  return (
    <section className={cn('py-20 md:py-28', theme.background, theme.foreground)}>
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={cn('h-px w-16', theme.accent)} />
            <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
              Gallery
            </span>
          </div>
          {gallery.title && (
            <h2
              className={cn(
                'text-3xl md:text-4xl font-bold tracking-tight',
                theme.fontTitle,
              )}
            >
              {gallery.title}
            </h2>
          )}
          {gallery.description && (
            <p className={cn('mt-3 text-sm opacity-50 max-w-md', theme.fontBody)}>
              {gallery.description}
            </p>
          )}
        </motion.div>

        {/* Mosaic grid — asymmetric layout */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {photos.map((block, index) => {
              // First photo is a feature (spans 2 cols), 4th is tall, rest are normal
              const isFeature = index === 0
              const isTall = index === 3

              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3) }}
                  className={cn(
                    'overflow-hidden group',
                    theme.cardStyle,
                    theme.radiusMedium,
                    isFeature ? 'col-span-2' : 'col-span-1',
                  )}
                >
                  <div
                    className={cn(
                      'relative overflow-hidden',
                      isFeature ? 'aspect-video' : (isTall ? 'aspect-[3/4]' : 'aspect-square'),
                    )}
                  >
                    {block.image ? (
                      <Image
                        loader={passthroughLoader}
                        unoptimized
                        src={block.image}
                        alt={block.caption ?? `Photo ${index + 1}`}
                        fill
                        sizes={
                          isFeature
                            ? '(max-width: 768px) 100vw, 66vw'
                            : '(max-width: 768px) 50vw, 33vw'
                        }
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className={cn('w-full h-full', theme.muted)} />
                    )}

                    {/* Caption on hover */}
                    {block.caption && (
                      <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
                        <div
                          className={cn(
                            'px-2 py-1 text-[10px]',
                            theme.card,
                            theme.radiusMedium,
                          )}
                        >
                          <span className={cn('opacity-70', theme.fontBody)}>
                            {block.caption}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* Empty state placeholder */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 opacity-25">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={cn(
                  'rounded-lg',
                  theme.muted,
                  i === 0 ? 'col-span-2 aspect-video' : 'aspect-square',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
