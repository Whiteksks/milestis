'use client'

import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { findPhotobookRepeatingImage, SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

interface GalleryLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function GalleryLumiere({ sectionContent, theme, imageContent }: GalleryLumiereProps) {
  const { gallery } = sectionContent
  const images = gallery.photos ?? []

  return (
    <SectionWrapper
      id="gallery"
      themeForeground={theme.foreground}
      // Добавляем относительное позиционирование для декоративных элементов
      className={cn('overflow-x-clip relative', theme.background)}
    >
      {/* Декоративный эффект зернистости (Grain Overlay) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="max-w-7xl mx-auto px-8 @md:px-14 @lg:px-20 py-24 @md:py-32 relative z-10">
        
        {/* Шапка галереи в стиле музейной экспликации */}
        <Animate trigger="mount" direction="none" className="mb-20 @md:mb-28 flex flex-col items-center">
          <div className="w-px h-12 bg-current opacity-20 mb-8" /> {/* Вертикальная линия вместо горизонтальной */}
          {gallery.label && (
            <p className={cn('mb-4 text-[9px] uppercase tracking-[0.4em] opacity-30', theme.fontBody)}>
              {gallery.label}
            </p>
          )}
          
          {gallery.title && (
            <h2 className={cn(
              'text-center text-2xl @md:text-4xl font-extralight tracking-tight italic mb-4',
              theme.fontTitle
            )}>
              {gallery.title}
            </h2>
          )}
          
          {gallery.description && (
            <p className={cn(
              'max-w-md text-center text-[10px] uppercase tracking-[0.3em] opacity-40 leading-relaxed',
              theme.fontBody
            )}>
              {gallery.description}
            </p>
          )}
        </Animate>

        {/* Сетка с эффектом смещения (Offset Grid) */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-4 space-y-4 @md:space-y-6  ">
            {images.map((photo, index) => {
              const galleryImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'gallery', photo.id) : undefined
              const photoNum = String(index + 1).padStart(2, '0')

              return (
                <Animate
                  key={photo.id}
                  direction="up"
                  distance={30}
                  delay={index * 0.08}
                  // Lumiere Style: Нечетные карточки чуть смещаем вниз для динамики
                  className={cn(
                    "flex flex-col gap-4",
                    index % 2 === 1 ? "@sm:translate-y-12" : ""
                  )}
                >
                  {/* Фото в "паспарту" или с тонкой рамкой */}
                  <div className="group relative bg-white/[0.02] p-2 transition-transform duration-700 hover:scale-[1.02]">
                    <div className="overflow-hidden border border-current/5">
                      {galleryImage?.value.asset.src && (
                        <SlotImage
                          slotId={galleryImage.slotId}
                          value={galleryImage.value}
                          alt={photo.caption ?? `Photo ${photoNum}`}
                          className="grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0"
                          sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 30vw"
                        />
                      )}
                    </div>
                  </div>

                  {/* Подпись в стиле каталога */}
                  <div className="flex flex-col gap-1 px-1">
                    <div className="flex justify-between items-center">
                      <span className={cn('text-[9px] font-medium opacity-40 tabular-nums', theme.fontBody)}>
                        {photoNum}
                      </span>
                      <div className="h-px w-4 bg-current opacity-10" />
                    </div>
                    {photo.caption && (
                      <p className={cn('text-[10px] lowercase italic opacity-30 tracking-wide', theme.fontBody)}>
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </Animate>
              )
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="grid grid-cols-1 @sm:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-current/[0.02] border border-current/5" />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
