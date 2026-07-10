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

const MIN_R = 48 // smallest bubble visual radius
const MAX_R = 82 // largest bubble visual radius
const HITBOX_RATIO = 0.78 // collision radius is smaller than visual -> slight overlap allowed
const CURSOR_RADIUS = 170 // how far the cursor push reaches
const CURSOR_FORCE = 2600 // strength of cursor repulsion
const FRICTION = 0.94 // velocity damping each frame
const RESTITUTION = 0.7 // bounciness on wall/bubble collisions

interface Bubble {
  photo: EventGuestPhoto | null
  x: number
  y: number
  vx: number
  vy: number
  r: number
  hue: number
}

/** Deterministic pseudo-random so the very first paint is SSR-safe. */
function seeded(i: number, salt: number) {
  const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return v - Math.floor(v)
}

export function TemplateEventBubbles({ theme, eventPhotos }: EventTemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const nodesRef = useRef<(HTMLDivElement | null)[]>([])
  const cursorRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })
  const sizeRef = useRef({ w: 0, h: 0 })
  const rafRef = useRef<number>(0)
  // Track whether a bubble was dragged vs. clicked, to avoid opening lightbox on drag
  const downRef = useRef<{ moved: boolean }>({ moved: false })

  const items: (EventGuestPhoto | null)[] =
    eventPhotos.length > 0 ? eventPhotos : Array<null>(7).fill(null)

  // Build the bubble world once we know the container size
  const initBubbles = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const w = el.clientWidth
    const h = el.clientHeight
    sizeRef.current = { w, h }
    bubblesRef.current = items.map((photo, i) => {
      const r = MIN_R + seeded(i, 1) * (MAX_R - MIN_R)
      return {
        photo,
        x: r + seeded(i, 2) * (w - 2 * r),
        y: r + seeded(i, 3) * (h - 2 * r),
        vx: (seeded(i, 4) - 0.5) * 40,
        vy: (seeded(i, 5) - 0.5) * 40,
        r,
        hue: Math.round(seeded(i, 6) * 360),
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventPhotos.length])

  // Physics loop
  useEffect(() => {
    initBubbles()
    let last = performance.now()

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033)
      last = now
      const { w, h } = sizeRef.current
      const bubbles = bubblesRef.current
      const cursor = cursorRef.current

      for (const b of bubbles) {
        // cursor repulsion
        if (cursor.active) {
          const dx = b.x - cursor.x
          const dy = b.y - cursor.y
          const dist = Math.hypot(dx, dy) || 0.0001
          if (dist < CURSOR_RADIUS + b.r) {
            const push = (CURSOR_FORCE / (dist * dist)) * (CURSOR_RADIUS + b.r)
            b.vx += (dx / dist) * push * dt
            b.vy += (dy / dist) * push * dt
          }
        }

        // integrate
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.vx *= FRICTION
        b.vy *= FRICTION

        // walls
        if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * RESTITUTION }
        if (b.x > w - b.r) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * RESTITUTION }
        if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy) * RESTITUTION }
        if (b.y > h - b.r) { b.y = h - b.r; b.vy = -Math.abs(b.vy) * RESTITUTION }
      }

      // bubble-bubble collisions using SMALLER hitboxes so they can overlap a bit
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const a = bubbles[i]
          const b = bubbles[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy) || 0.0001
          const minDist = (a.r + b.r) * HITBOX_RATIO
          if (dist < minDist) {
            const nx = dx / dist
            const ny = dy / dist
            const overlap = (minDist - dist) / 2
            a.x -= nx * overlap
            a.y -= ny * overlap
            b.x += nx * overlap
            b.y += ny * overlap
            // exchange velocity along the collision normal
            const dvx = b.vx - a.vx
            const dvy = b.vy - a.vy
            const rel = dvx * nx + dvy * ny
            if (rel < 0) {
              const imp = -(1 + RESTITUTION) * rel / 2
              a.vx -= imp * nx; a.vy -= imp * ny
              b.vx += imp * nx; b.vy += imp * ny
            }
          }
        }
      }

      // paint via transform (cheap, no React re-render)
      for (let i = 0; i < bubbles.length; i++) {
        const node = nodesRef.current[i]
        const b = bubbles[i]
        if (node) node.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px)`
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventPhotos.length])

  // Resize handling
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth
      const h = el.clientHeight
      sizeRef.current = { w, h }
      // keep bubbles inside new bounds
      for (const b of bubblesRef.current) {
        b.x = Math.min(Math.max(b.x, b.r), w - b.r)
        b.y = Math.min(Math.max(b.y, b.r), h - b.r)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Pointer -> cursor repulsion
  const handlePointer = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
    downRef.current.moved = true
  }
  const handlePointerLeave = () => {
    cursorRef.current.active = false
  }

  // Mobile: shake to scatter the bubbles
  useEffect(() => {
    const onMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity
      if (!acc) return
      const magnitude = Math.hypot(acc.x ?? 0, acc.y ?? 0, acc.z ?? 0)
      if (magnitude > 22) {
        for (const b of bubblesRef.current) {
          b.vx += (Math.random() - 0.5) * magnitude * 18
          b.vy += (Math.random() - 0.5) * magnitude * 18
        }
      }
    }
    window.addEventListener('devicemotion', onMotion)
    return () => window.removeEventListener('devicemotion', onMotion)
  }, [])

  // iOS requires an explicit permission gesture for motion events
  const [needsMotionPerm, setNeedsMotionPerm] = useState(false)
  useEffect(() => {
    const DME = (window as unknown as { DeviceMotionEvent?: { requestPermission?: () => Promise<string> } }).DeviceMotionEvent
    if (typeof DME?.requestPermission === 'function') setNeedsMotionPerm(true)
  }, [])
  const requestMotion = async () => {
    const DME = (window as unknown as { DeviceMotionEvent?: { requestPermission?: () => Promise<string> } }).DeviceMotionEvent
    try {
      const res = await DME?.requestPermission?.()
      if (res === 'granted') setNeedsMotionPerm(false)
    } catch { /* ignore */ }
  }

  const handleBubbleClick = (photo: EventGuestPhoto | null) => {
    if (!photo) return
    const idx = eventPhotos.findIndex((p) => p.id === photo.id)
    if (idx !== -1) setLightboxIndex(idx)
  }

  return (
    <>
      <div className={cn('relative min-h-screen overflow-hidden', theme.background)}>
        <div
          ref={containerRef}
          className="absolute inset-0 touch-none"
          onPointerMove={handlePointer}
          onPointerDown={(e) => { downRef.current.moved = false; handlePointer(e) }}
          onPointerLeave={handlePointerLeave}
        >
          {items.map((photo, i) => {
            const b = bubblesRef.current[i]
            const r = b?.r ?? MIN_R
            const hue = b?.hue ?? 200
            return (
              <div
                key={photo?.id ?? i}
                ref={(n) => { nodesRef.current[i] = n }}
                className="absolute left-0 top-0 will-change-transform"
                style={{ width: r * 2, height: r * 2 }}
              >
                <button
                  onPointerUp={() => { if (!downRef.current.moved) handleBubbleClick(photo) }}
                  className="group relative block h-full w-full cursor-pointer rounded-full focus-visible:outline-none"
                  aria-label="Open photo"
                >
                  {photo ? (
                    <span className="relative block h-full w-full overflow-hidden rounded-full">
                      <Image
                        src={getPhotoUrl(photo)}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        sizes={`${Math.round(r * 2)}px`}
                        unoptimized
                      />
                    </span>
                  ) : (
                    <span className="relative block h-full w-full overflow-hidden rounded-full">
                      <PhotoPlaceholder index={i} w={r * 2} h={r * 2} />
                    </span>
                  )}

                  {/* glossy bubble skin: rim light + specular highlight */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{
                      boxShadow: `inset 0 0 20px 4px hsla(${hue},80%,90%,0.35), inset 8px 10px 16px hsla(${hue},70%,100%,0.5), 0 8px 24px rgba(0,0,0,0.35)`,
                      border: '1px solid hsla(0,0%,100%,0.4)',
                    }}
                  />
                  <span className="pointer-events-none absolute left-[22%] top-[16%] h-[22%] w-[28%] rounded-full bg-white/70 blur-[2px]" />
                  <span className="pointer-events-none absolute right-[24%] bottom-[22%] h-[8%] w-[10%] rounded-full bg-white/50 blur-[1px]" />
                </button>
              </div>
            )
          })}
        </div>

        {needsMotionPerm && (
          <button
            onClick={requestMotion}
            className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-neutral-900 shadow-lg backdrop-blur"
          >
            Enable shake
          </button>
        )}
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