"use client"

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'


interface GalleryCirclesProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryCircles({ sectionContent, theme }: GalleryCirclesProps) {
  const images = sectionContent.gallery.images ?? []

  if (images.length === 0) {
    return null
  }

  const title = sectionContent.gallery.title || 'Галерея'
  const description = sectionContent.gallery.description

  return (
    <section className="min-h-screen bg-[#2c2a27] py-16 px-6">
      {/* Текстура стены */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-6 mb-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-600/60" />
            <div className="w-2 h-2 bg-amber-600 rotate-45" />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-600/60" />
          </div>
          <h2 className={cn('text-4xl md:text-6xl text-amber-50', theme.fontTitle)}>{title}</h2>
          {description && <p className="text-stone-500 mt-4 max-w-md mx-auto">{description}</p>}
        </div>

        {/* Галерея с рамками */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {images.map((block, index) => {
            // Чередуем вертикальные и горизонтальные рамки
            const isVertical = index % 3 === 1
            const aspectClass = isVertical ? "aspect-[3/4]" : "aspect-[4/3]"

            return (
              <div key={index} className="group">
                {/* Внешняя рамка (золотая) */}
                <div className="bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 p-1 shadow-2xl">
                  {/* Внутренняя рамка (тёмная) */}
                  <div className="bg-[#1a1817] p-2">
                    {/* Паспарту (белое) */}
                    <div className="bg-amber-50/90 p-4">
                      <div className={`relative ${aspectClass} overflow-hidden`}>
                        <img
                          src={block.image || '/placeholder.svg'}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Блик на стекле */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Тень под рамкой */}
                <div className="h-4 mx-4 bg-gradient-to-b from-black/30 to-transparent blur-sm -mt-2" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
