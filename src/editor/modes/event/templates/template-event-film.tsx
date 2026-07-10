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

/** Extract the raw hex from a Tailwind bg class like 'bg-[#1C1C1C]' */
function bgHex(bgClass: string) {
  return bgClass.match(/#[0-9A-Fa-f]{3,8}/)?.[0] ?? '#000000'
}

const FRAME_W = 420 // width of one film frame
const FRAME_H = 300 // height of one film frame
const GAP = 24 // spacing between frames

/** A single film frame with an internal parallax that reacts to horizontal scroll. */
function FilmFrame({
  photo,
  index,
  scrollX,
  containerWidth,
  onClick,
  theme,
}: {
  photo: EventGuestPhoto | null
  index: number
  scrollX: MotionValue<number>
  containerWidth: number
  onClick: (photo: EventGuestPhoto) => void
  theme: EventTemplateProps['theme']
}) {
  // Position of this frame's center along the track
  const frameCenter = index * (FRAME_W + GAP) + FRAME_W / 2
  // How far the frame center is from the viewport center, as scroll progresses
  const rangeStart = frameCenter - containerWidth
  const rangeEnd = frameCenter

  // Parallax: shift the inner image opposite to scroll for depth
  const imgX = useTransform(scrollX, [rangeStart, rangeEnd], ['-18%', '18%'])
  // Focus effects: the frame nearest the viewport center gets fuller scale/opacity
  const scale = useTransform(scrollX, [rangeStart, frameCenter - containerWidth / 2, rangeEnd], [0.9, 1, 0.9])
  const opacity = useTransform(scrollX, [rangeStart, frameCenter - containerWidth / 2, rangeEnd], [0.55, 1, 0.55])

  return (
    <motion.div
      className="relative flex-none"
      style={{ width: FRAME_W, height: FRAME_H, scale, opacity }}
    >
      {photo ? (
        <button
          onClick={() => onClick(photo)}
          className={cn('group relative block h-full w-full overflow-hidden rounded-md border-2 cursor-zoom-in focus-visible:outline-none', theme.border, theme.card, theme.shadow)}
        >
          {/* wider inner image so the parallax shift never reveals edges */}
          <motion.div className="absolute inset-0" style={{ x: imgX, width: '136%', left: '-18%' }}>
            <Image
              src={getPhotoUrl(photo)}
              alt=""
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes={`${FRAME_W}px`}
              unoptimized
            />
          </motion.div>
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </button>
      ) : (
        <PhotoPlaceholder index={index} w={FRAME_W} h={FRAME_H} theme={theme} />
      )}
    </motion.div>
  )
}

/** Sprocket-hole strip that runs above and below the film, like real 35mm stock. */
function Sprockets({ theme }: { theme: EventTemplateProps['theme'] }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      {Array.from({ length: 40 }).map((_, i) => (
        <span key={i} className={cn('h-3 w-6 flex-none rounded-[3px] opacity-60', theme.muted)} />
      ))}
    </div>
  )
}

export function TemplateEventFilm({ theme, eventPhotos }: EventTemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const { scrollX } = useScroll({ container: scrollRef })
  // Smooth the raw scroll value so parallax feels fluid, not jittery
  const smoothX = useSpring(scrollX, { stiffness: 120, damping: 30, mass: 0.4 })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setContainerWidth(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Translate vertical wheel gestures into horizontal scroll for trackpads/mice
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY
        e.preventDefault()
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
      <div className={cn('relative flex min-h-screen flex-col items-center justify-center overflow-hidden', theme.background)}>
        {/* film reel body */}
        <div className={cn('relative w-full py-3', theme.card)} style={{ boxShadow: '0 0 80px rgba(0,0,0,0.4)' }}>
          <div className={cn('border-y', theme.border)}>
            <Sprockets theme={theme} />
          </div>

          <div
            ref={scrollRef}
            className="no-scrollbar flex items-center gap-6 overflow-x-auto overflow-y-hidden px-[calc(50vw-210px)] py-6"
            style={{ scrollSnapType: 'x proximity', WebkitOverflowScrolling: 'touch' }}
          >
            {frames.map((photo, i) => (
              <div key={photo?.id ?? i} style={{ scrollSnapAlign: 'center' }}>
                <FilmFrame
                  photo={photo}
                  index={i}
                  scrollX={smoothX}
                  containerWidth={containerWidth}
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

        {/* edge fades — match background color */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32" style={{ background: `linear-gradient(to right, ${bgHex(theme.background)}, transparent)` }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32" style={{ background: `linear-gradient(to left, ${bgHex(theme.background)}, transparent)` }} />
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