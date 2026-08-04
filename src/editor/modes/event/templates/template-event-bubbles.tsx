'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
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

const MAX_BUBBLES = 30
const MIN_R = 48
const MAX_R = 82
const HITBOX_RATIO = 0.65
const CURSOR_RADIUS = 170
const CURSOR_FORCE = 2600
const FRICTION = 0.94
const RESTITUTION = 0.7

interface Bubble {
  photo: EventGuestPhoto | null
  x: number
  y: number
  vx: number
  vy: number
  r: number
  hue: number
}

function seeded(i: number, salt: number) {
  const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return v - Math.floor(v)
}

export function TemplateEventBubbles({ theme, eventPhotos }: EventTemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const nodesRef = useRef<(HTMLDivElement | null)[]>([])
  const cursorRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })
  const sizeRef = useRef({ w: 0, h: 0 })
  const rafRef = useRef<number>(0)
  
  // Кэш для координат контейнера, чтобы не вызывать getBoundingClientRect на каждый чих
  const containerRectRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 })
  // Единый вектор для акселерометра
  const gravityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  
  const pointerStartRef = useRef<{ x: number; y: number; isDown: boolean }>({ x: 0, y: 0, isDown: false })

  const items = eventPhotos.length > 0 ? eventPhotos.slice(0, MAX_BUBBLES) : Array<null>(7).fill(null)

  // Чем больше пузырей — тем меньше радиус (scale от 1.0 при 5 до 0.65 при MAX_BUBBLES)
  const radiusScale = Math.max(0.65, 1 - (items.length - 5) * 0.025)
  const dynMinR = MIN_R * radiusScale
  const dynMaxR = MAX_R * radiusScale

  // Предварительно рассчитываем стабильные радиусы и цвета
  const precalculatedStatic = items.map((_, i) => {
    const r = dynMinR + seeded(i, 1) * (dynMaxR - dynMinR)
    const hue = Math.round(seeded(i, 6) * 360)
    return { r, hue }
  })

  const initBubbles = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    
    const rect = el.getBoundingClientRect()
    containerRectRef.current = { left: rect.left, top: rect.top }
    
    const w = el.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200)
    const h = el.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800)
    sizeRef.current = { w, h }

    bubblesRef.current = items.map((photo, i) => {
      const { r, hue } = precalculatedStatic[i]
      return {
        photo,
        x: r + seeded(i, 2) * (w - 2 * r),
        y: r + seeded(i, 3) * (h - 2 * r),
        vx: (seeded(i, 4) - 0.5) * 40,
        vy: (seeded(i, 5) - 0.5) * 40,
        r,
        hue,
      }
    })
    setIsInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventPhotos.length])

  // Физический движок
  useEffect(() => {
    initBubbles()
    let last = performance.now()

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.02)
      last = now
      
      const { w, h } = sizeRef.current
      const bubbles = bubblesRef.current
      const cursor = cursorRef.current
      const gravity = gravityRef.current

      if (w === 0 || h === 0 || bubbles.length === 0) {
        rafRef.current = requestAnimationFrame(step)
        return
      }

      // 1. Обновление позиций и внешних сил
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i]

        // Эффект от акселерометра (если есть сила)
        if (gravity.x !== 0 || gravity.y !== 0) {
          b.vx += gravity.x * dt * 150
          b.vy += gravity.y * dt * 150
        }

        // Эффект от курсора
        if (cursor.active) {
          const dx = b.x - cursor.x
          const dy = b.y - cursor.y
          const dist = Math.hypot(dx, dy) || 0.0001
          const maxDist = CURSOR_RADIUS + b.r
          
          if (dist < maxDist) {
            const push = (CURSOR_FORCE / (dist * dist)) * maxDist
            b.vx += (dx / dist) * push * dt
            b.vy += (dy / dist) * push * dt
          }
        }

        b.x += b.vx * dt
        b.y += b.vy * dt
        b.vx *= FRICTION
        b.vy *= FRICTION

        // Столкновения со стенами
        if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * RESTITUTION }
        else if (b.x > w - b.r) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * RESTITUTION }
        if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy) * RESTITUTION }
        else if (b.y > h - b.r) { b.y = h - b.r; b.vy = -Math.abs(b.vy) * RESTITUTION }
      }

      // Затухание всплеска тряски
      gravity.x *= 0.9
      gravity.y *= 0.9

      // 2. Оптимизированный цикл столкновений пузырей между собой
      const len = bubbles.length
      for (let i = 0; i < len; i++) {
        const a = bubbles[i]
        for (let j = i + 1; j < len; j++) {
          const b = bubbles[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const minDist = (a.r + b.r) * HITBOX_RATIO
          
          // Быстрая проверка по квадрату (AABB), чтобы не считать тяжёлый Math.hypot зря
          if (Math.abs(dx) < minDist && Math.abs(dy) < minDist) {
            const dist = Math.hypot(dx, dy) || 0.0001
            
            if (dist < minDist) {
              const nx = dx / dist
              const ny = dy / dist
              const overlap = (minDist - dist) * 0.5
              
              a.x -= nx * overlap
              a.y -= ny * overlap
              b.x += nx * overlap
              b.y += ny * overlap

              const dvx = b.vx - a.vx
              const dvy = b.vy - a.vy
              const rel = dvx * nx + dvy * ny
              
              if (rel < 0) {
                const imp = (-(1 + RESTITUTION) * rel) * 0.5
                a.vx -= imp * nx
                a.vy -= imp * ny
                b.vx += imp * nx
                b.vy += imp * ny
              }
            }
          }
        }
      }

      // 3. Быстрый рендеринг через мутацию стилей DOM
      for (let i = 0; i < len; i++) {
        const node = nodesRef.current[i]
        if (node) {
          const b = bubbles[i]
          node.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0px)`
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [initBubbles])

  // Слушатель ресайза (кэшируем размеры и координаты)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return
      const { width: w, height: h } = entries[0].contentRect
      sizeRef.current = { w, h }
      
      const rect = el.getBoundingClientRect()
      containerRectRef.current = { left: rect.left, top: rect.top }
      
      for (const b of bubblesRef.current) {
        b.x = Math.min(Math.max(b.x, b.r), w - b.r)
        b.y = Math.min(Math.max(b.y, b.r), h - b.r)
      }
    })
    
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = containerRectRef.current
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top
    cursorRef.current = { x: currentX, y: currentY, active: true }

    if (pointerStartRef.current.isDown) {
      const distMoved = Math.hypot(currentX - pointerStartRef.current.x, currentY - pointerStartRef.current.y)
      if (distMoved > 6) pointerStartRef.current.isDown = false 
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = containerRectRef.current
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top
    pointerStartRef.current = { x: startX, y: startY, isDown: true }
    cursorRef.current = { x: startX, y: startY, active: true }
  }

  const handleBubbleRelease = (photo: EventGuestPhoto | null) => {
    if (pointerStartRef.current.isDown && photo) {
      const idx = eventPhotos.findIndex((p) => p.id === photo.id)
      if (idx !== -1) setLightboxIndex(idx)
    }
    pointerStartRef.current.isDown = false
  }

  // Оптимизированный акселерометр
  useEffect(() => {
    const onMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity
      if (!acc) return
      const mX = acc.x ?? 0
      const mY = acc.y ?? 0
      const magnitude = Math.hypot(mX, mY, acc.z ?? 0)
      
      if (magnitude > 22) {
        // Задаем вектор силы. Направление зависит от наклона, добавляем легкий хаос
        gravityRef.current = {
          x: -mX + (Math.random() - 0.5) * 10,
          y: mY + (Math.random() - 0.5) * 10
        }
      }
    }
    window.addEventListener('devicemotion', onMotion)
    return () => window.removeEventListener('devicemotion', onMotion)
  }, [])

  const [needsMotionPerm, setNeedsMotionPerm] = useState(false)
  useEffect(() => {
    const DME = (window as { DeviceMotionEvent?: { requestPermission?: () => Promise<string> } }).DeviceMotionEvent
    if (typeof DME?.requestPermission === 'function') setNeedsMotionPerm(true)
  }, [])

  const requestMotion = async () => {
    const DME = (window as { DeviceMotionEvent?: { requestPermission?: () => Promise<string> } }).DeviceMotionEvent
    try {
      const res = await DME?.requestPermission?.()
      if (res === 'granted') setNeedsMotionPerm(false)
    } catch { /* ignore */ }
  }

  return (
    <>
      <div className={cn('relative min-h-screen overflow-hidden select-none', theme.background)}>
        <div
          ref={containerRef}
          className="absolute inset-0 touch-none"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerLeave={() => { cursorRef.current.active = false; pointerStartRef.current.isDown = false }}
        >
          {items.map((photo, i) => {
            const { r, hue } = precalculatedStatic[i]
            
            return (
              <div
                key={photo?.id ?? i}
                ref={(n) => { nodesRef.current[i] = n }}
                className={cn("absolute left-0 top-0 will-change-transform transition-opacity duration-300", 
                  isInitialized ? "opacity-100" : "opacity-0"
                )}
                style={{ 
                  width: r * 2, 
                  height: r * 2,
                  transform: !isInitialized ? `translate(${r * 0.5 + i * 60}px, ${r * 0.5 + i * 40}px)` : undefined 
                }}
              >
                <button
                  onPointerUp={() => handleBubbleRelease(photo)}
                  className="group relative block h-full w-full cursor-pointer rounded-full focus-visible:outline-none"
                  aria-label="Open photo"
                >
                  <span className="relative block h-full w-full overflow-hidden rounded-full">
                    {photo ? (
                      <Image
                        src={getPhotoUrl(photo)}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 pointer-events-none"
                        sizes={`${Math.round(r * 2)}px`}
                        unoptimized
                      />
                    ) : (
                      <PhotoPlaceholder index={i} w={r * 2} h={r * 2} />
                    )}
                  </span>

                  {/* Скин мыльного пузыря */}
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