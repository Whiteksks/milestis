'use client'

import { useEffect } from 'react'

export interface UseParallaxLayerOptions {
  /** Enable/disable parallax without changing callsites. */
  enabled: boolean
  /** Scroll container that drives the parallax. */
  scrollContainerRef: React.RefObject<HTMLElement | null>
  /** Viewport element used to compute safe overscan clamp. */
  viewportRef: React.RefObject<HTMLElement | null>
  /** The layer element that will be translated/scaled. */
  layerRef: React.RefObject<HTMLElement | null>
  /** 0..1. Fraction of available overscan travel to use. */
  strength: number
  /** >1. Overscan to avoid revealing empty edges while translating. */
  scale: number
}

function clamp(value: number, min: number, max: number) {
  if (value < min) return min
  if (value > max) return max
  return value
}

function clamp01(value: number) {
  if (Number.isNaN(value)) return 0
  return clamp(value, 0, 1)
}

export function useParallaxLayer({
  enabled,
  scrollContainerRef,
  viewportRef,
  layerRef,
  strength,
  scale,
}: UseParallaxLayerOptions) {
  useEffect(() => {
    const scrollEl = scrollContainerRef.current
    const viewportEl = viewportRef.current
    const layerEl = layerRef.current

    if (!enabled || !scrollEl || !layerEl) {
      if (layerEl) layerEl.style.transform = ''
      return
    }

    let raf = 0

    const scheduleUpdate = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        update()
      })
    }

    const update = () => {
      // Spread the parallax motion across the *entire* scroll range so it doesn't
      // hit the overscan clamp early on long pages.
      const scrollRange = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight)
      const progress = scrollRange > 0 ? clamp01(scrollEl.scrollTop / scrollRange) : 0

      const viewportH = viewportEl?.clientHeight ?? scrollEl.clientHeight

      // With `transform-origin: top`, we effectively have all overscan available at the bottom,
      // so we translate upward (negative Y) up to the extra height produced by scaling.
      const maxShift = viewportH > 0 ? Math.max(0, viewportH * (scale - 1)) : 0
      const travel = maxShift > 0 ? maxShift * clamp01(strength) : 0
      const y = -travel * progress

      layerEl.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`
    }

    update()
    scrollEl.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleUpdate) : null
    resizeObserver?.observe(scrollEl)
    if (viewportEl) resizeObserver?.observe(viewportEl)

    return () => {
      scrollEl.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      resizeObserver?.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [enabled, scrollContainerRef, viewportRef, layerRef, strength, scale])
}
