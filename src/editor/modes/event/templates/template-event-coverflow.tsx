'use client'

import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
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

const ROTATION = 50 
const VISIBLE = 3 // Количество отображаемых карточек по бокам от центра

function useCoverflowDimensions() {
  const [dimensions, setDimensions] = useState({ cardW: 340, cardH: 340, spacing: 210 })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => {
      if (mq.matches) {
        setDimensions({ cardW: 260, cardH: 260, spacing: 140 })
      } else {
        setDimensions({ cardW: 340, cardH: 340, spacing: 210 })
      }
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return dimensions
}

interface CardProps {
  photo: EventGuestPhoto | null
  offset: number
  index: number
  onClick: (photo: EventGuestPhoto, isCenter: boolean) => void
  theme: EventTemplateProps['theme']
  cardW: number
  cardH: number
  spacing: number
}

function Card({ photo, offset, index, onClick, theme, cardW, cardH, spacing }: CardProps) {
  const abs = Math.abs(offset)
  const clamped = Math.max(-1, Math.min(1, offset))
  const isCenter = offset === 0

  const x = offset * spacing
  const rotateY = -clamped * ROTATION
  const z = -abs * 150
  const scale = isCenter ? 1 : 0.8
  const opacity = abs > VISIBLE ? 0 : 1 - abs * 0.25
  const brightness = isCenter ? 1 : 0.45

  return (
    <motion.button
      onClick={() => photo && onClick(photo, isCenter)}
      className="absolute top-1/2 left-1/2 origin-center focus-visible:outline-none cursor-pointer"
      style={{ width: cardW, height: cardH, zIndex: 100 - Math.round(abs) }}
      animate={{
        x: `calc(-50% + ${x}px)`,
        y: '-50%',
        rotateY,
        z,
        scale,
        opacity,
        filter: `brightness(${brightness})`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 0.8 }}
    >
      <div className={cn('relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-white/10', theme.shadow)}>
        {photo ? (
          <Image
            src={getPhotoUrl(photo)}
            alt=""
            fill
            className="object-cover select-none"
            sizes={`${cardW}px`}
            priority={abs <= 1}
            unoptimized
          />
        ) : (
          <PhotoPlaceholder index={index} w={cardW} h={cardH} theme={theme} />
        )}
        {isCenter && (
          <span className={cn('pointer-events-none absolute inset-0 rounded-2xl ring-2 animate-pulse', theme.accent.replace('bg-', 'ring-'))} />
        )}
      </div>

      {/* Зеркальное отражение */}
      <div
        className="absolute left-0 top-full h-[30%] w-full overflow-hidden rounded-2xl opacity-20 pointer-events-none hidden md:block"
        style={{
          transform: 'scaleY(-1)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
        }}
        aria-hidden
      >
        {photo ? (
          <Image src={getPhotoUrl(photo)} alt="" fill className="object-cover" sizes={`${cardW}px`} unoptimized />
        ) : (
          <PhotoPlaceholder index={index} w={cardW} h={cardH} theme={theme} />
        )}
      </div>
    </motion.button>
  )
}

export function TemplateEventCoverflow({ theme, eventPhotos }: EventTemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [active, setActive] = useState(0)
  const lastWheelTime = useRef(0)
  const { cardW, cardH, spacing } = useCoverflowDimensions()

  const items = useMemo(() => 
    eventPhotos.length > 0 ? eventPhotos : Array<null>(6).fill(null),
    [eventPhotos]
  )
  const count = items.length

  const clampActive = useCallback((n: number) => Math.max(0, Math.min(count - 1, n)), [count])
  const go = useCallback((dir: number) => setActive((a) => clampActive(a + dir)), [clampActive])

  // Интеллектуальный скролл (wheel) с троттлингом
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 15) return 

      const now = performance.now()
      if (now - lastWheelTime.current < 180) return 
      
      lastWheelTime.current = now
      go(delta > 0 ? 1 : -1)
    }
    
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [go])

  // Стрелки клавиатуры
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // Плавный жест Drag с помощью встроенной физики Framer Motion на контейнере сцены
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = spacing / 2
    if (info.offset.x < -threshold || info.velocity.x < -300) {
      go(1)
    } else if (info.offset.x > threshold || info.velocity.x > 300) {
      go(-1)
    }
  }

  const handleCardClick = useCallback((photo: EventGuestPhoto, isCenter: boolean) => {
    if (isCenter) {
      const idx = eventPhotos.findIndex((p) => p.id === photo.id)
      if (idx !== -1) setLightboxIndex(idx)
    } else {
      const idx = items.findIndex((p) => p?.id === photo.id)
      if (idx !== -1) setActive(idx)
    }
  }, [eventPhotos, items])

  // Стабильные ссылки на методы лайтбокса для исключения ререндера
  const handleCloseLightbox = useCallback(() => setLightboxIndex(null), [])
  const handlePrevLightbox = useCallback(() => {
    setLightboxIndex((i) => i !== null ? (i - 1 + eventPhotos.length) % eventPhotos.length : null)
  }, [eventPhotos.length])
  const handleNextLightbox = useCallback(() => {
    setLightboxIndex((i) => i !== null ? (i + 1) % eventPhotos.length : null)
  }, [eventPhotos.length])

  return (
    <>
      <div className={cn('relative flex min-h-screen flex-col items-center justify-center overflow-hidden select-none touch-none', theme.background)}>
        
        {/* Контейнер 3D Сцены с нативным Drag-эффектом */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="relative h-[440px] w-full cursor-grab active:cursor-grabbing flex items-center justify-center"
          style={{ perspective: 1200 }}
        >
          <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {items.map((photo, i) => {
              const offset = i - active
              if (Math.abs(offset) > VISIBLE) return null
              return (
                <Card 
                  key={photo?.id ?? i} 
                  photo={photo} 
                  offset={offset} 
                  index={i} 
                  onClick={handleCardClick} 
                  theme={theme}
                  cardW={cardW}
                  cardH={cardH}
                  spacing={spacing}
                />
              )
            })}
          </div>
        </motion.div>

        {/* Счетчики и индикация пагинации */}
        <div className="mt-12 flex flex-col items-center gap-4 z-30">
          <p className={cn('font-mono text-xs uppercase tracking-[0.3em]', theme.mutedText)}>
            {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>

          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                  i === active ? `w-6 ${theme.accent}` : `w-1.5 ${theme.muted} hover:opacity-80`,
                )}
              />
            ))}
          </div>
        </div>

        {/* Навигационные кнопки */}
        <button
          onClick={() => go(-1)}
          disabled={active === 0}
          aria-label="Previous"
          className={cn('hidden md:block absolute left-6 top-1/2 z-[200] -translate-y-1/2 rounded-full p-3 backdrop-blur transition disabled:opacity-10 hover:opacity-80 cursor-pointer', theme.muted)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={theme.mutedText}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => go(1)}
          disabled={active === count - 1}
          aria-label="Next"
          className={cn('hidden md:block absolute right-6 top-1/2 z-[200] -translate-y-1/2 rounded-full p-3 backdrop-blur transition disabled:opacity-10 hover:opacity-80 cursor-pointer', theme.muted)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={theme.mutedText}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <PhotoLightbox
        photos={eventPhotos}
        index={lightboxIndex}
        onClose={handleCloseLightbox}
        onPrev={handlePrevLightbox}
        onNext={handleNextLightbox}
      />
    </>
  )
}