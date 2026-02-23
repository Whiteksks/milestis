'use client'

import { useState, useEffect } from 'react'
import type React from 'react'

/**
 * Returns true when the scroll container is at (or very near) its bottom edge.
 * Threshold is the number of pixels from the bottom that still counts as "at bottom".
 */
export function useScrollAtBottom(
  scrollRef: React.RefObject<HTMLDivElement | null>,
  threshold = 8,
): boolean {
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const check = () => {
      const remaining = el.scrollHeight - el.scrollTop - el.clientHeight
      setAtBottom(remaining <= threshold)
    }

    check()

    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', check)
      ro.disconnect()
    }
  }, [scrollRef, threshold])

  return atBottom
}
