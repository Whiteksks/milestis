'use client'

import { useState, useMemo } from 'react'
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

/** Extract the raw hex from a Tailwind bg class like 'bg-[#F5F1EB]' */
function bgHex(bgClass: string) {
  return bgClass.match(/#[0-9A-Fa-f]{3,8}/)?.[0] ?? '#000000'
}

const GAP = 40 // horizontal spacing between photos in a lane

// Size variants per lane depth — nearer lanes are bigger, giving parallax depth
const SIZES = [
  { w: 300, h: 200 },
  { w: 260, h: 190 },
  { w: 340, h: 220 },
  { w: 240, h: 170 },
  { w: 310, h: 210 },
  { w: 280, h: 200 },
] as const

/** Deterministic "random" size per lane × photo index — SSR safe */
function getSize(laneIdx: number, photoIdx: number) {
  return SIZES[(laneIdx * 2 + photoIdx * 3) % SIZES.length]
}

// 4 lanes at different vertical positions, speeds and directions = parallax depth.
// `dir: 1` scrolls left→right, `dir: -1` scrolls right→left.
// Larger scale + faster = "closer"; smaller + slower = "farther".
const LANES = [
  { top: '6%',  dur: 55, dir: -1, scale: 0.72, rot: -1.5, blur: 1.5, opacity: 0.55 },
  { top: '28%', dur: 40, dir:  1, scale: 0.88, rot:  1.0, blur: 0.6, opacity: 0.8 },
  { top: '50%', dur: 30, dir: -1, scale: 1.0,  rot: -0.8, blur: 0,   opacity: 1 },
  { top: '72%', dur: 46, dir:  1, scale: 0.8,  rot:  1.8, blur: 1.0, opacity: 0.7 },
] as const

type LaneCfg = typeof LANES[number]

function ParallaxLane({
  photos,
  cfg,
  laneIdx,
  onPhotoClick,
  theme,
}: {
  photos: (EventGuestPhoto | null)[]
  cfg: LaneCfg
  laneIdx: number
  onPhotoClick: (photo: EventGuestPhoto) => void
  theme: EventTemplateProps['theme']
}) {
  const sizes = useMemo(() => photos.map((_, i) => getSize(laneIdx, i)), [photos, laneIdx])
  const doubled = useMemo(() => [...photos, ...photos], [photos])
  const doubledSizes = useMemo(() => [...sizes, ...sizes], [sizes])
  
  // singleW = total width of one "cycle" plus gaps before duplication
  const singleW = useMemo(() => {
    return sizes.reduce((acc, s) => acc + s.w * cfg.scale + GAP, 0)
  }, [sizes, cfg.scale])

  // Direction: -1 travels right→left ([0, -singleW]), 1 travels left→right ([-singleW, 0])
  const from = cfg.dir === 1 ? -singleW : 0
  const to = cfg.dir === 1 ? 0 : -singleW

  return (
    <div
      className="absolute left-0 flex items-center"
      style={{ top: cfg.top, opacity: cfg.opacity, filter: cfg.blur ? `blur(${cfg.blur}px)` : undefined }}
    >
      <motion.div
        className="flex items-center"
        style={{ willChange: 'transform', gap: GAP }}
        animate={{ x: [from, to] }}
        transition={{
          duration: cfg.dur,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
      >
        {doubled.map((photo, i) => {
          const { w, h } = doubledSizes[i]
          const sw = w * cfg.scale
          const sh = h * cfg.scale
          return (
            <div key={i} style={{ transform: `rotate(${cfg.rot}deg)`, flex: '0 0 auto' }}>
              {photo ? (
                <button
                  onClick={() => onPhotoClick(photo)}
                  className={cn(
                    'group relative block overflow-hidden rounded-xl cursor-zoom-in transition-transform duration-500 ease-out hover:scale-105 hover:z-10 focus-visible:outline-none',
                    theme.shadow
                  )}
                  style={{ width: sw, height: sh }}
                >
                  <Image
                    src={getPhotoUrl(photo)}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes={`${Math.round(sw)}px`}
                    unoptimized
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </button>
              ) : (
                <PhotoPlaceholder index={laneIdx * 10 + i} w={sw} h={sh} theme={theme} />
              )}
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

const PHOTOS_PER_LANE = 4

export function TemplateEventParallax({ theme, eventPhotos }: EventTemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const handlePhotoClick = (photo: EventGuestPhoto) => {
    const idx = eventPhotos.findIndex((p) => p.id === photo.id)
    if (idx !== -1) setLightboxIndex(idx)
  }

  // Distribute photos round-robin across lanes; pad short lanes by repeating safely
  const lanePhotos = useMemo(() => {
    const lanes: (EventGuestPhoto | null)[][] = LANES.map(() => [])

    if (eventPhotos.length === 0) {
      LANES.forEach((_, li) => {
        lanes[li] = Array<null>(PHOTOS_PER_LANE).fill(null)
      })
    } else {
      eventPhotos.forEach((p, i) => lanes[i % LANES.length].push(p))
      lanes.forEach((lane, li) => {
        if (lane.length === 0) {
          lanes[li] = Array<null>(PHOTOS_PER_LANE).fill(null)
        } else {
          // Safe fill up to min PHOTOS_PER_LANE without risking infinite loop
          const originalLength = lane.length
          while (lane.length < PHOTOS_PER_LANE) {
            lane.push(...lane.slice(0, PHOTOS_PER_LANE - lane.length))
          }
        }
      })
    }
    return lanes
  }, [eventPhotos])

  return (
    <>
      <div className={cn('relative min-h-screen overflow-hidden', theme.background)}>
        {/* edge fades — color matches the background so photos dissolve at sides */}
        <div 
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24" 
          style={{ background: `linear-gradient(to right, ${bgHex(theme.background)}, transparent)` }} 
        />
        <div 
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24" 
          style={{ background: `linear-gradient(to left, ${bgHex(theme.background)}, transparent)` }} 
        />

        {LANES.map((cfg, i) => (
          <ParallaxLane
            key={i}
            photos={lanePhotos[i]}
            cfg={cfg}
            laneIdx={i}
            onPhotoClick={handlePhotoClick}
            theme={theme}
          />
        ))}
      </div>

      <PhotoLightbox
        photos={eventPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i !== null ? (i - 1 + eventPhotos.length) % eventPhotos.length : null))}
        onNext={() => setLightboxIndex((i) => (i !== null ? (i + 1) % eventPhotos.length : null))}
      />
    </>
  )
}