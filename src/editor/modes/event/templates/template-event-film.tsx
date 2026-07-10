'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { EventTemplateProps } from '@/editor/lib/template-types'
import type { EventGuestPhoto } from '@/editor/modes/event/content-types'
import { PhotoPlaceholder } from './photo-placeholder'
import { PhotoLightbox } from './photo-lightbox'

function getPhotoUrl(photo: EventGuestPhoto): string {
  if (photo.thumbUrl) return photo.thumbUrl
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ''
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(photo.storageRef)}?alt=media`
}

function bgHex(bgClass: string) {
  return bgClass.match(/#[0-9A-Fa-f]{3,8}/)?.[0] ?? '#000000'
}

// Теперь GAP задаем в Tailwind (gap-4 на мобилках, gap-6 на десктопе)
// Размеры кадра теперь адаптивные: контролируются через CSS-классы

function FilmFrame({
  photo,
  index,
  scrollX,
  containerRef,
  onClick,
  theme,
}: {
  photo: EventGuestPhoto | null
  index: number
  scrollX: MotionValue<number>
  containerRef: React.RefObject<HTMLDivElement | null>
  onClick: (photo: EventGuestPhoto) => void
  theme: EventTemplateProps['theme']
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [edgeRange, setEdgeRange] = useState<[number, number]>([0, 0])
  const [centerRange, setCenterRange] = useState<[number, number, number]>([0, 0, 0])

  // Динамически пересчитываем позиции кадра относительно контейнера для идеальной точности
  useEffect(() => {
    const container = containerRef.current
    const frame = frameRef.current
    if (!container || !frame) return

    const updatePositions = () => {
      const containerW = container.clientWidth
      const frameW = frame.clientWidth
      const frameLeft = frame.offsetLeft
      
      // Точка, когда правый край кадра только появляется справа
      const start = frameLeft - containerW
      // Точка, когда левый край кадра уходит за левую границу
      const end = frameLeft + frameW
      // Точка точного центра
      const center = frameLeft - (containerW / 2) + (frameW / 2)

      setEdgeRange([start, end])
      setCenterRange([start, center, end])
    }

    updatePositions()
    const ro = new ResizeObserver(updatePositions)
    ro.observe(container)
    window.addEventListener('resize', updatePositions)
    
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updatePositions)
    }
  }, [containerRef, photo])

  // Анимации теперь абсолютно предсказуемы на любых экранах:
  const imgX = useTransform(scrollX, edgeRange, ['-15%', '15%'])
  const scale = useTransform(scrollX, centerRange, [0.92, 1, 0.92])
  const opacity = useTransform(scrollX, centerRange, [0.6, 1, 0.6])

  return (
    <motion.div
      ref={frameRef}
      className="relative h-[220px] w-[290px] flex-none sm:h-[300px] sm:w-[420px]"
      style={{ scale, opacity }}
    >
      {photo ? (
        <button
          onClick={() => onClick(photo)}
          className={cn(
            'group relative block h-full w-full overflow-hidden rounded-md border-2 cursor-zoom-in focus-visible:outline-none transition-shadow duration-300', 
            theme.border, theme.card, theme.shadow
          )}
        >
          {/* Контейнер с overflow-hidden + увеличенная ширина для параллакса */}
          <motion.div className="absolute inset-0 select-none will-change-transform" style={{ x: imgX, width: '130%', left: '-15%' }}>
            <Image
              src={getPhotoUrl(photo)}
              alt=""
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 290px, 420px"
              unoptimized
            />
          </motion.div>
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      ) : (
        // Передаем адаптивные размеры в плейсхолдер, если они там используются жестко
        <PhotoPlaceholder index={index} w={420} h={300} theme={theme} />
      )}
    </motion.div>
  )
}

function Sprockets({ theme }: { theme: EventTemplateProps['theme'] }) {
  return (
    <div className="flex items-center gap-2 px-1 py-1.5 sm:gap-3 sm:px-2 sm:py-2 overflow-hidden select-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <span key={i} className={cn('h-2.5 w-5 sm:h-3 sm:w-6 flex-none rounded-[2px] sm:rounded-[3px] opacity-40', theme.muted)} />
      ))}
    </div>
  )
}

export function TemplateEventFilm({ theme, eventPhotos }: EventTemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { scrollX } = useScroll({ container: scrollRef })
  // Оптимизировали spring для большей отзывчивости (уменьшили массу, увеличили жесткость)
  const smoothX = useSpring(scrollX, { stiffness: 150, damping: 28, mass: 0.2 })

  // Плавный кроссбраузерный хак для скролла колесиком мыши
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        el.scrollBy({
          left: e.deltaY * 1.2,
          behavior: 'auto' // 'auto' + useSpring дает идеальный плавный синематик-эффект
        })
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const handlePhotoClick = (photo: EventGuestPhoto) => {
    const idx = eventPhotos.findIndex((p) => p.id === photo.id)
    if (idx !== -1) setLightboxIndex(idx)
  }

  const frames: (EventGuestPhoto | null)[] =
    eventPhotos.length > 0 ? eventPhotos : Array<null>(6).fill(null)

  return (
    <>
      <div className={cn('relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-10', theme.background)}>
        
        {/* Тело кинопленки */}
        <div className={cn('relative w-full py-2 sm:py-4 shadow-2xl', theme.card)}>
          
          <div className={cn('border-y', theme.border)}>
            <Sprockets theme={theme} />
          </div>

          <div
            ref={scrollRef}
            // Динамические паддинги: px-[calc(50vw-145px)] для мобилок и px-[calc(50vw-210px)] для ПК 
            // гарантируют, что первый и последний кадры встанут ровно по центру экрана при крайних положениях скролла.
            className="no-scrollbar flex items-center gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden px-[calc(50vw-145px)] sm:px-[calc(50vw-210px)] py-4 sm:py-8"
            style={{ 
              scrollSnapType: 'x mandatory', // Переключили на mandatory для четкой фиксации кадра по центру
              WebkitOverflowScrolling: 'touch' 
            }}
          >
            {frames.map((photo, i) => (
              <div key={photo?.id ?? i} style={{ scrollSnapAlign: 'center' }}>
                <FilmFrame
                  photo={photo}
                  index={i}
                  scrollX={smoothX}
                  containerRef={scrollRef}
                  onClick={handlePhotoClick}
                  theme={theme}
                />
              </div>
            ))}
          </div>

          <div className={cn('border-y', theme.border)}>
            <Sprockets theme={theme} />
          </div>
        </div>

        {/* Градиентные затемнения по бокам (скрываем на совсем маленьких экранах, чтобы не мешать обзору, либо уменьшаем ширину) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-32 md:w-48" style={{ background: `linear-gradient(to right, ${bgHex(theme.background)}, transparent)` }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-32 md:w-48" style={{ background: `linear-gradient(to left, ${bgHex(theme.background)}, transparent)` }} />
      </div>

      <PhotoLightbox
        photos={eventPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => i !== null ? (i - 1 + eventPhotos.length) % eventPhotos.length : null)}
        onNext={() => setLightboxIndex((i) => i !== null ? (i + 1) % eventPhotos.length : null)}
      />
    </>
  )
}