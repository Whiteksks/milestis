'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    let timer: ReturnType<typeof setTimeout>
    const debounced = () => { clearTimeout(timer); timer = setTimeout(update, 200) }
    mq.addEventListener('change', debounced)
    return () => { mq.removeEventListener('change', debounced); clearTimeout(timer) }
  }, [])
  return isMobile
}

const GAP = 44

const SIZES = [
  { w: 300, h: 200 },
  { w: 260, h: 190 },
  { w: 340, h: 220 },
  { w: 240, h: 170 },
  { w: 310, h: 210 },
  { w: 280, h: 200 },
] as const

function getSize(laneIdx: number, photoIdx: number) {
  return SIZES[(laneIdx * 2 + photoIdx * 3) % SIZES.length]
}

const LANES = [
  { top: '5%',  dur: 58, dir: -1, scale: 0.70, rot: -1.5, blur: 2,   opacity: 0.5 },
  { top: '27%', dur: 42, dir:  1, scale: 0.88, rot:  1.0, blur: 0.8, opacity: 0.82 },
  { top: '49%', dur: 32, dir: -1, scale: 1.0,  rot: -0.8, blur: 0,   opacity: 1 },
  { top: '71%', dur: 48, dir:  1, scale: 0.8,  rot:  1.8, blur: 1.2, opacity: 0.72 },
] as const

type LaneCfg = typeof LANES[number]

interface ParallaxLaneProps {
  photos: (EventGuestPhoto | null)[]
  cfg: LaneCfg
  laneIdx: number
  onPhotoClick: (photo: EventGuestPhoto) => void
  theme: EventTemplateProps['theme']
  isMobile: boolean
  reduceMotion: boolean
}

function ParallaxLane({
  photos,
  cfg,
  laneIdx,
  onPhotoClick,
  theme,
  isMobile,
  reduceMotion,
}: ParallaxLaneProps) {
  const sizes = useMemo(() => photos.map((_, i) => getSize(laneIdx, i)), [photos, laneIdx])

  const blur = isMobile ? 0 : cfg.blur
  const duration = isMobile ? cfg.dur * 0.85 : cfg.dur

  const laneStyles = {
    '--lane-duration': `${duration}s`,
    '--lane-direction': cfg.dir === 1 ? 'reverse' : 'normal',
  } as React.CSSProperties

  return (
    <div
      className="pointer-events-none absolute left-0 select-none"
      style={{
        top: cfg.top,
        opacity: cfg.opacity,
        transform: `scale(${cfg.scale}) translateZ(0)`,
        transformOrigin: 'left center',
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      <div
        className={cn(
          "flex items-center pointer-events-auto",
          !reduceMotion && "animate-marquee"
        )}
        style={{ ...laneStyles, width: 'max-content' }}
      >
        {photos.map((photo, i) => {
          const { w, h } = sizes[i]
          return (
            <div
              key={`${laneIdx}-${i}-${photo?.id || 'placeholder'}`}
              className="flex-shrink-0"
              style={{ transform: `rotate(${cfg.rot}deg)`, marginRight: GAP }}
            >
              {photo ? (
                <button
                  onClick={() => onPhotoClick(photo)}
                  className={cn(
                    'group relative block overflow-hidden rounded-2xl ring-1 ring-white/10 cursor-zoom-in',
                    'transition-all duration-500 ease-out hover:z-10 hover:scale-[1.04]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
                    theme.shadow,
                  )}
                  style={{ width: w, height: h }}
                >
                  <Image
                    src={getPhotoUrl(photo)}
                    alt=""
                    width={w}
                    height={h}
                    loading="lazy"
                    className="object-cover h-full w-full transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes={`${Math.round(w)}px`}
                    unoptimized
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25" />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/0 transition-all duration-500 group-hover:ring-white/40" />
                </button>
              ) : (
                <div className="overflow-hidden rounded-2xl ring-1 ring-white/10" style={{ width: w, height: h }}>
                  <PhotoPlaceholder index={laneIdx * 10 + i} w={w} h={h} theme={theme} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Оптимальное число карточек на одну дорожку для создания бесшовного marquee на экранах до 2K
const VISIBLE_PHOTOS_PER_LANE = 6 

export function TemplateEventParallax({ theme, eventPhotos }: EventTemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isMobile = useIsMobile()
  const reduceMotion = !!useReducedMotion()

  const activeLanes = useMemo(() => (isMobile ? LANES.slice(1, 3) : LANES), [isMobile])

  const handlePhotoClick = useCallback((photo: EventGuestPhoto) => {
    const idx = eventPhotos.findIndex((p) => p.id === photo.id)
    if (idx !== -1) setLightboxIndex(idx)
  }, [eventPhotos])

  // Оптимизированное распределение картинок
  const lanePhotos = useMemo(() => {
    const laneCount = activeLanes.length
    if (eventPhotos.length === 0) {
      return activeLanes.map(() => Array<null>(VISIBLE_PHOTOS_PER_LANE * 2).fill(null))
    }

    // 1. Распределяем ВСЕ 100+ фото по дорожкам равномерно, чтобы они не дублировались сразу
    const distributedLanes: EventGuestPhoto[][] = activeLanes.map(() => [])
    eventPhotos.forEach((photo, idx) => {
      distributedLanes[idx % laneCount].push(photo)
    })

    return distributedLanes.map((lane) => {
      let currentLane = [...lane]

      // 2. Ограничиваем максимальное количество фото в DOM на одну дорожку (для производительности),
      // но следим, чтобы контента хватало для заполнения экрана (не меньше VISIBLE_PHOTOS_PER_LANE)
      const targetLength = Math.max(VISIBLE_PHOTOS_PER_LANE, Math.min(currentLane.length, 10))
      
      // Обрезаем лишнее, если фото слишком много (остальные будут доступны в лайтбоксе)
      if (currentLane.length > targetLength) {
        currentLane = currentLane.slice(0, targetLength)
      }

      // Если фото мало — циклически заполняем до минимума
      let idx = 0
      const initialLength = currentLane.length
      while (currentLane.length < VISIBLE_PHOTOS_PER_LANE) {
        currentLane.push(currentLane[idx % initialLength])
        idx++
      }

      // 3. Дублируем массив ТОЛЬКО итогового оптимизированного пула для работы CSS Marquee (50% / 50%)
      return [...currentLane, ...currentLane]
    })
  }, [eventPhotos, activeLanes])

  const edge = useMemo(() => bgHex(theme.background), [theme.background])

  return (
    <>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          will-change: transform;
          animation: marquee var(--lane-duration) linear infinite;
          animation-direction: var(--lane-direction);
        }
      `}</style>

      <div className={cn('relative min-h-screen overflow-hidden', theme.background)}>
        {!isMobile && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(55% 45% at 18% 12%, hsla(210,60%,50%,0.12), transparent 70%),' +
                'radial-gradient(45% 40% at 85% 85%, hsla(280,45%,50%,0.10), transparent 70%)',
            }}
          />
        )}

        {activeLanes.map((cfg, i) => (
          <ParallaxLane
            key={cfg.top}
            photos={lanePhotos[i]}
            cfg={cfg}
            laneIdx={i}
            onPhotoClick={handlePhotoClick}
            theme={theme}
            isMobile={isMobile}
            reduceMotion={reduceMotion}
          />
        ))}

        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 md:w-40"
          style={{ background: `linear-gradient(to right, ${edge}, transparent)` }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 md:w-40"
          style={{ background: `linear-gradient(to left, ${edge}, transparent)` }}
        />

        {!isMobile && (
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{ background: 'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.45))' }}
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-8 z-30 text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-white/60">Gallery in Motion</p>
        </div>
      </div>

      <PhotoLightbox
        photos={eventPhotos} // Лайтбокс по-прежнему видит все 100+ фотографий!
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i !== null ? (i - 1 + eventPhotos.length) % eventPhotos.length : null))}
        onNext={() => setLightboxIndex((i) => (i !== null ? (i + 1) % eventPhotos.length : null))}
      />
    </>
  )
}