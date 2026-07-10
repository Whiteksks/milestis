'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
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

const GAP = 260 
const MIN_PHOTOS_PER_COL = 4

const SIZES = [
  { w: 150, h: 200 },
  { w: 168, h: 224 },
  { w: 138, h: 184 },
  { w: 180, h: 240 },
  { w: 156, h: 208 },
  { w: 174, h: 232 },
  { w: 144, h: 192 },
  { w: 162, h: 216 },
] as const

function getSize(colIdx: number, photoIdx: number) {
  return SIZES[(colIdx * 3 + photoIdx * 5) % SIZES.length]
}

const COLS = [
  { left: '6%',  dur: 44, startY: -120, rot: -3.0, scale: 0.6,  opacity: 0.45, blur: 2.5, drift: 14 },
  { left: '26%', dur: 34, startY: -420, rot:  1.8, scale: 0.82, opacity: 0.7,  blur: 1.0, drift: 22 },
  { left: '47%', dur: 26, startY: -220, rot: -1.2, scale: 1.0,  opacity: 1,     blur: 0,   drift: 30 },
  { left: '67%', dur: 38, startY: -520, rot:  2.4, scale: 0.74, opacity: 0.6,  blur: 1.6, drift: 18 },
  { left: '85%', dur: 30, startY: -150, rot: -2.4, scale: 0.9,  opacity: 0.85, blur: 0.4, drift: 26 },
] as const

type ColCfg = typeof COLS[number]

interface FloatingColumnProps {
  photos: (EventGuestPhoto | null)[]
  cfg: ColCfg
  colIdx: number
  onPhotoClick: (photo: EventGuestPhoto) => void
  theme: EventTemplateProps['theme']
}

function FloatingColumn({ photos, cfg, colIdx, onPhotoClick, theme }: FloatingColumnProps) {
  // Оптимизация 1: Мемоизация тяжелых расчетов размеров и высоты сдвига
  const { doubled, doubledSizes, singleH } = useMemo(() => {
    const sizes = photos.map((_, i) => getSize(colIdx, i))
    const singleH = sizes.reduce((acc, s) => acc + s.h * cfg.scale + GAP, 0)
    
    return {
      doubled: [...photos, ...photos],
      doubledSizes: [...sizes, ...sizes],
      singleH
    }
  }, [photos, colIdx, cfg.scale])

  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none"
      style={{ 
        left: cfg.left, 
        opacity: cfg.opacity, 
        filter: cfg.blur ? `blur(${cfg.blur}px)` : undefined,
        width: 180 * cfg.scale // Фиксируем ширину колонки для предотвращения Layout Shifts
      }}
    >
      <motion.div
        className="pointer-events-auto"
        style={{ willChange: 'transform' }}
        animate={{ y: [cfg.startY, cfg.startY - singleH] }}
        transition={{ duration: cfg.dur, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
      >
        {doubled.map((photo, i) => {
          const { w, h } = doubledSizes[i]
          const sw = w * cfg.scale
          const sh = h * cfg.scale
          const photoIndex = i % photos.length

          return (
            <div key={`${colIdx}-${i}`} style={{ paddingBottom: GAP, width: sw }}>
              <motion.div
                animate={{ x: [-cfg.drift, cfg.drift, -cfg.drift] }}
                transition={{
                  duration: cfg.dur * 0.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: photoIndex * 0.4,
                }}
                // Оптимизация 2: Объединяем rotate и transform во Framer Motion для стабильности GPU
                style={{ rotate: cfg.rot }}
              >
                {photo ? (
                  <button
                    onClick={() => onPhotoClick(photo)}
                    className="group relative block cursor-zoom-in focus-visible:outline-none"
                    style={{ width: sw, height: sh }}
                  >
                    <span
                      className="pointer-events-none absolute -inset-3 rounded-[28px] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      style={{ background: 'radial-gradient(closest-side, hsla(0,0%,100%,0.35), transparent)' }}
                    />
                    <span
                      className={cn(
                        'relative block h-full w-full overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all duration-700 ease-out group-hover:scale-105 group-hover:ring-white/40',
                        theme.shadow,
                      )}
                    >
                      <Image
                        src={getPhotoUrl(photo)}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                        sizes={`${Math.round(sw)}px`}
                        unoptimized
                      />
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25" />
                    </span>
                  </button>
                ) : (
                  <div className="overflow-hidden rounded-2xl ring-1 ring-white/10" style={{ width: sw, height: sh }}>
                    <PhotoPlaceholder index={colIdx * 10 + i} w={sw} h={sh} theme={theme} />
                  </div>
                )}
              </motion.div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

export function TemplateEventCosmos({ theme, eventPhotos }: EventTemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Оптимизация 3: useCallback для предотвращения ререндеров
  const handlePhotoClick = useCallback((photo: EventGuestPhoto) => {
    const idx = eventPhotos.findIndex((p) => p.id === photo.id)
    if (idx !== -1) setLightboxIndex(idx)
  }, [eventPhotos])

  // Оптимизация 4: Безопасное и производительное распределение фото по колонкам без risk of infinite loop
  const colPhotos = useMemo(() => {
    const buckets: (EventGuestPhoto | null)[][] = COLS.map(() => [])

    if (eventPhotos.length === 0) {
      return buckets.map(() => Array<null>(MIN_PHOTOS_PER_COL).fill(null))
    }

    // Распределяем round-robin
    eventPhotos.forEach((p, i) => {
      buckets[i % COLS.length].push(p)
    })

    // Гарантируем заполнение (минимум 4 элемента) безопасным способом через остаток от деления
    return buckets.map((col) => {
      if (col.length === 0) {
        return Array<null>(MIN_PHOTOS_PER_COL).fill(null)
      }
      
      const filledSubColumn = [...col]
      let index = 0
      while (filledSubColumn.length < MIN_PHOTOS_PER_COL) {
        filledSubColumn.push(col[index % col.length])
        index++
      }
      return filledSubColumn
    })
  }, [eventPhotos])

  return (
    <>
      <div className={cn('relative min-h-screen overflow-hidden', theme.background)}>
        {/* Задний фон */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 20% 15%, hsla(220,60%,40%,0.18), transparent 70%),' +
              'radial-gradient(50% 40% at 85% 80%, hsla(280,50%,45%,0.14), transparent 70%),' +
              'radial-gradient(45% 35% at 60% 40%, hsla(190,55%,45%,0.10), transparent 70%)',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: 'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.5))' }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-black/50 to-transparent" />

        {COLS.map((cfg, i) => (
          <FloatingColumn
            key={i}
            photos={colPhotos[i]}
            cfg={cfg}
            colIdx={i}
            onPhotoClick={handlePhotoClick}
            theme={theme}
          />
        ))}

        <div className="pointer-events-none absolute inset-x-0 top-10 z-30 text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-white/60">A Gallery Among the Stars</p>
        </div>
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