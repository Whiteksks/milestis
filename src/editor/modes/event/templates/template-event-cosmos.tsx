'use client'

import { useState } from 'react'
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

const GAP = 300 // large gap = lots of empty space

// Slight size variants — all small/medium, max delta ~24px so nothing looks out of place
const SIZES = [
  { w: 82,  h: 108 },
  { w: 92,  h: 122 },
  { w: 76,  h: 100 },
  { w: 100, h: 132 },
  { w: 86,  h: 114 },
  { w: 96,  h: 126 },
  { w: 78,  h: 104 },
  { w: 90,  h: 118 },
] as const

/** Deterministic "random" size per column × photo index — no Math.random() = SSR safe */
function getSize(colIdx: number, photoIdx: number) {
  return SIZES[(colIdx * 3 + photoIdx * 5) % SIZES.length]
}

// 5 lanes: varied speed, initial stagger, subtle tilt
const COLS = [
  { left: '4%',  dur: 24, startY: 0,    rot: -2.5 },
  { left: '23%', dur: 30, startY: -320, rot:  1.5 },
  { left: '43%', dur: 20, startY: -160, rot: -1.0 },
  { left: '63%', dur: 27, startY: -460, rot:  2.0 },
  { left: '81%', dur: 22, startY: -90,  rot: -2.0 },
] as const

type ColCfg = typeof COLS[number]

function FallingColumn({
  photos,
  cfg,
  colIdx,
  onPhotoClick,
  theme,
}: {
  photos: (EventGuestPhoto | null)[]
  cfg: ColCfg
  colIdx: number
  onPhotoClick: (photo: EventGuestPhoto) => void
  theme: EventTemplateProps['theme']
}) {
  const sizes  = photos.map((_, i) => getSize(colIdx, i))
  const doubled      = [...photos, ...photos]
  const doubledSizes = [...sizes,  ...sizes]
  // singleH = total height of one "cycle" before duplication
  const singleH = sizes.reduce((acc, s) => acc + s.h + GAP, 0)

  return (
    <div className="absolute top-0" style={{ left: cfg.left }}>
      <motion.div
        style={{ willChange: 'transform' }}
        animate={{ y: [cfg.startY, cfg.startY - singleH] }}
        transition={{
          duration: cfg.dur,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
      >
        {doubled.map((photo, i) => {
          const { w, h } = doubledSizes[i]
          return (
            <div key={i} style={{ paddingBottom: GAP, transform: `rotate(${cfg.rot}deg)` }}>
              {photo ? (
                <button
                  onClick={() => onPhotoClick(photo)}
                  className={cn('relative block overflow-hidden rounded-md cursor-zoom-in transition-transform hover:scale-105 focus-visible:outline-none', theme.shadow)}
                  style={{ width: w, height: h }}
                >
                  <Image
                    src={getPhotoUrl(photo)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes={`${w}px`}
                    unoptimized
                  />
                </button>
              ) : (
                <PhotoPlaceholder index={colIdx * 10 + i} w={w} h={h} theme={theme} />
              )}
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

const PHOTOS_PER_COL = 4

export function TemplateEventCosmos({ theme, eventPhotos }: EventTemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const handlePhotoClick = (photo: EventGuestPhoto) => {
    const idx = eventPhotos.findIndex((p) => p.id === photo.id)
    if (idx !== -1) setLightboxIndex(idx)
  }

  // Distribute photos round-robin across columns; pad short columns by repeating
  const colPhotos: (EventGuestPhoto | null)[][] = COLS.map(() => [])

  if (eventPhotos.length === 0) {
    COLS.forEach((_, ci) => {
      colPhotos[ci] = Array<null>(PHOTOS_PER_COL).fill(null)
    })
  } else {
    eventPhotos.forEach((p, i) => colPhotos[i % COLS.length].push(p))
    colPhotos.forEach((col, ci) => {
      if (col.length === 0) {
        colPhotos[ci] = Array<null>(PHOTOS_PER_COL).fill(null)
      } else {
        while (col.length < 3) col.push(...col.slice())
      }
    })
  }

  return (
    <>
      <div className={cn('relative min-h-screen overflow-hidden', theme.background)}>
        {COLS.map((cfg, i) => (
          <FallingColumn
            key={i}
            photos={colPhotos[i]}
            cfg={cfg}
            colIdx={i}
            onPhotoClick={handlePhotoClick}
            theme={theme}
          />
        ))}
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
