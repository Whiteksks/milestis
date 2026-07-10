'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
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

/** Extract the raw hex from a Tailwind bg class like 'bg-[#0C0F14]' */
function bgHex(bgClass: string) {
  return bgClass.match(/#[0-9A-Fa-f]{3,8}/)?.[0] ?? '#000000'
}

const CARD_W = 340 // base card width
const CARD_H = 340 // base card height
const SPACING = 240 // horizontal distance between neighbor cards
const ROTATION = 55 // degrees the side cards rotate
const VISIBLE = 4 // how many cards to render on each side of center

/** A single cover-flow card whose transform is derived from its offset to the active card. */
function Card({
  photo,
  offset,
  index,
  onClick,
  theme,
}: {
  photo: EventGuestPhoto | null
  offset: number // signed distance from the active card (0 = center)
  index: number
  onClick: (photo: EventGuestPhoto, isCenter: boolean) => void
  theme: EventTemplateProps['theme']
}) {
  const abs = Math.abs(offset)
  const clamped = Math.max(-1, Math.min(1, offset))
  const isCenter = offset === 0

  // Cards fan out along X, rotate on Y, and recede on Z as they move from center.
  const x = offset * SPACING
  const rotateY = -clamped * ROTATION
  const z = -abs * 140
  const scale = isCenter ? 1 : 0.82
  const opacity = abs > VISIBLE ? 0 : 1 - abs * 0.12
  const brightness = isCenter ? 1 : 0.55

  return (
    <motion.button
      onClick={() => photo && onClick(photo, isCenter)}
      className="absolute top-1/2 left-1/2 origin-center focus-visible:outline-none"
      style={{ width: CARD_W, height: CARD_H, zIndex: 100 - abs }}
      animate={{
        x: `calc(-50% + ${x}px)`,
        y: '-50%',
        rotateY,
        z,
        scale,
        opacity,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 32 }}
    >
      <div
        className={cn('relative h-full w-full overflow-hidden rounded-2xl', theme.shadow)}
        style={{ filter: `brightness(${brightness})` }}
      >
        {photo ? (
          <Image
            src={getPhotoUrl(photo)}
            alt=""
            fill
            className="object-cover"
            sizes={`${CARD_W}px`}
            priority={abs <= 1}
            unoptimized
          />
        ) : (
          <PhotoPlaceholder index={index} w={CARD_W} h={CARD_H} theme={theme} />
        )}
        {/* ring highlight on the active card — uses accent color */}
        {isCenter && (
          <span className={cn('pointer-events-none absolute inset-0 rounded-2xl ring-2', theme.accent.replace('bg-', 'ring-'))} />
        )}
      </div>

      {/* floor reflection */}
      <div
        className="absolute left-0 top-full h-full w-full overflow-hidden rounded-2xl opacity-40"
        style={{
          transform: 'scaleY(-1)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 55%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 55%)',
        }}
        aria-hidden
      >
        {photo ? (
          <Image src={getPhotoUrl(photo)} alt="" fill className="object-cover" sizes={`${CARD_W}px`} unoptimized />
        ) : (
          <PhotoPlaceholder index={index} w={CARD_W} h={CARD_H} theme={theme} />
        )}
      </div>
    </motion.button>
  )
}

export function TemplateEventCoverflow({ theme, eventPhotos }: EventTemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [active, setActive] = useState(0)
  const wheelLock = useRef(false)
  const dragStart = useRef<{ x: number; active: number } | null>(null)

  const items: (EventGuestPhoto | null)[] =
    eventPhotos.length > 0 ? eventPhotos : Array<null>(6).fill(null)
  const count = items.length

  const clampActive = useCallback((n: number) => Math.max(0, Math.min(count - 1, n)), [count])
  const go = useCallback((dir: number) => setActive((a) => clampActive(a + dir)), [clampActive])

  // Wheel -> step through cards (throttled so one gesture = one step)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 8 || wheelLock.current) return
      wheelLock.current = true
      go(delta > 0 ? 1 : -1)
      setTimeout(() => { wheelLock.current = false }, 260)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [go])

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // Pointer drag / swipe
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, active }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const steps = Math.round(-dx / SPACING)
    setActive(clampActive(dragStart.current.active + steps))
  }
  const onPointerUp = () => { dragStart.current = null }

  const handleCardClick = (photo: EventGuestPhoto, isCenter: boolean) => {
    if (isCenter) {
      const idx = eventPhotos.findIndex((p) => p.id === photo.id)
      if (idx !== -1) setLightboxIndex(idx)
    } else {
      // clicking a side card brings it to the center
      const idx = items.findIndex((p) => p?.id === photo.id)
      if (idx !== -1) setActive(idx)
    }
  }

  const activePhoto = items[active]

  return (
    <>
      <div className={cn('relative flex min-h-screen flex-col items-center justify-center overflow-hidden', theme.background)}>
        {/* 3D stage */}
        <div
          className="relative h-[360px] w-full cursor-grab touch-none active:cursor-grabbing select-none"
          style={{ perspective: 1600 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {items.map((photo, i) => {
              const offset = i - active
              if (Math.abs(offset) > VISIBLE) return null
              return (
                <Card key={photo?.id ?? i} photo={photo} offset={offset} index={i} onClick={handleCardClick} theme={theme} />
              )
            })}
          </div>
        </div>

        {/* caption + counter */}
        <div className="mt-24 flex flex-col items-center gap-4">
          <p className={cn('font-mono text-xs uppercase tracking-[0.3em]', theme.mutedText)}>
            {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>

          {/* dot indicators */}
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === active ? `w-6 ${theme.accent}` : `w-1.5 ${theme.muted} hover:opacity-80`,
                )}
              />
            ))}
          </div>
        </div>

        {/* prev / next affordances */}
        <button
          onClick={() => go(-1)}
          disabled={active === 0}
          aria-label="Previous"
          className={cn('absolute left-6 top-1/2 z-[200] -translate-y-1/2 rounded-full p-3 backdrop-blur transition disabled:opacity-30 hover:opacity-80', theme.muted)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={theme.mutedText}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => go(1)}
          disabled={active === count - 1}
          aria-label="Next"
          className={cn('absolute right-6 top-1/2 z-[200] -translate-y-1/2 rounded-full p-3 backdrop-blur transition disabled:opacity-30 hover:opacity-80', theme.muted)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={theme.mutedText}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
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