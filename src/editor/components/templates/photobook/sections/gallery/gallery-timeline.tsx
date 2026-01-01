"use client"

import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface GalleryTimelineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryTimeline({
  sectionContent,
  theme,
}: GalleryTimelineProps) {
  const { gallery } = sectionContent
  const title = gallery.title || "Gallery"
  const description = gallery.description || ""

  // gallery.images is PhotoBlock[]
  // PhotoBlock has image: string
  const images = gallery.images?.map(block => block.image) || []

  // Pattern: first photo big, others small around
  const mainImage = images[0]
  const sideImages = images.slice(1, 5)
  const bottomImages = images.slice(5)

  return (
    <section className="min-h-screen py-16 px-6" style={{ backgroundColor: theme.background }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: theme.accent }}>Collection</span>
          <h2 className={cn("font-serif text-4xl md:text-5xl mt-3", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>
          <p className={cn("mt-4 max-w-md mx-auto", theme.fontBody)} style={{ color: theme.mutedText }}>{description}</p>
        </div>

        {/* Main collage layout */}
        <div className="grid grid-cols-4 grid-rows-3 gap-3 aspect-4/3">
          {/* Big central photo */}
          <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg group">
            {mainImage && (
              <div className="relative h-full w-full">
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={mainImage}
                  alt="Main gallery image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Right photos */}
          {sideImages.slice(0, 2).map((img, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg group">
              {img && (
                <div className="relative h-full w-full">
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={img}
                    alt={`Side gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {/* Bottom row */}
          {sideImages.slice(2, 4).map((img, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg group">
              {img && (
                <div className="relative h-full w-full">
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={img}
                    alt={`Bottom gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {/* Last row full width */}
          {bottomImages.length > 0 && (
            <div className="col-span-4 grid grid-cols-4 gap-3">
              {bottomImages.slice(0, 4).map((img, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg group">
                  {img && (
                    <div className="relative h-full w-full">
                      <Image
                        loader={passthroughLoader}
                        unoptimized
                        src={img}
                        alt={`Extra gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photo counter */}
        <div className="mt-8 text-center">
          <span className="text-sm" style={{ color: theme.mutedText }}>{images.length} photos</span>
        </div>
      </div>
    </section>
  )
}
