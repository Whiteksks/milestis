"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react"
import { useMotionValue } from "framer-motion"
import type { DragBox, DecorationPosition } from "../components/editor/layout/decorationEdit/decorationTypes"
import { clamp } from "../components/editor/layout/decorationEdit/utils"

export interface UseDecorationDragOptions {
  decorationId: string | null
  /** Bounds container for drag constraints */
  boundsRef: RefObject<HTMLElement | null>
  /** Callback to commit position as percentages */
  onCommit: (position: DecorationPosition) => void
}

export interface UseDecorationDragReturn {
  dragX: ReturnType<typeof useMotionValue<number>>
  dragY: ReturnType<typeof useMotionValue<number>>
  startDrag: (e: React.PointerEvent, element: HTMLElement) => void
  commitDrag: (element: HTMLElement) => void
}

const EDGE_SCROLL_THRESHOLD_PX = 48
const EDGE_SCROLL_MAX_PX_PER_FRAME = 16

export function useDecorationDrag({ decorationId, boundsRef, onCommit }: UseDecorationDragOptions): UseDecorationDragReturn {
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)

  const constraintsRef = useRef<DragBox | undefined>(undefined)
  const activeElRef = useRef<HTMLElement | null>(null)
  const scrollElRef = useRef<HTMLElement | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const autoScrollRafRef = useRef<number | null>(null)
  const autoScrollVXRef = useRef(0)
  const autoScrollVYRef = useRef(0)

  const isDraggingRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)

  const startClientXRef = useRef(0)
  const startClientYRef = useRef(0)
  const lastClientXRef = useRef(0)
  const lastClientYRef = useRef(0)

  const startDragXRef = useRef(0)
  const startDragYRef = useRef(0)

  const startScrollLeftRef = useRef(0)
  const startScrollTopRef = useRef(0)

  const stopDragging = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null

    if (autoScrollRafRef.current !== null) {
      cancelAnimationFrame(autoScrollRafRef.current)
      autoScrollRafRef.current = null
    }
    autoScrollVXRef.current = 0
    autoScrollVYRef.current = 0

    isDraggingRef.current = false
    pointerIdRef.current = null
    activeElRef.current = null
    scrollElRef.current = null
    constraintsRef.current = undefined
  }, [])

  useEffect(() => {
    // Selection changed: cancel any in-flight drag and reset temporary offsets.
    stopDragging()
    dragX.set(0)
    dragY.set(0)
  }, [decorationId, dragX, dragY, stopDragging])

  const computeConstraints = useCallback(
    (element: HTMLElement): DragBox | undefined => {
      const container = boundsRef.current
      if (!container) return undefined

      const containerRect = container.getBoundingClientRect()
      const elRect = element.getBoundingClientRect()

      const currentLeft = elRect.left - containerRect.left
      const currentTop = elRect.top - containerRect.top
      const maxLeft = Math.max(0, containerRect.width - elRect.width)
      const maxTop = Math.max(0, containerRect.height - elRect.height)

      return {
        left: -currentLeft,
        top: -currentTop,
        right: maxLeft - currentLeft,
        bottom: maxTop - currentTop,
      }
    },
    [boundsRef],
  )

  const findScrollParent = useCallback((startEl: HTMLElement): HTMLElement | null => {
    let el: HTMLElement | null = startEl.parentElement
    while (el) {
      let overflowY = ""
      let overflowX = ""
      try {
        const style = window.getComputedStyle(el)
        overflowY = style.overflowY
        overflowX = style.overflowX
      } catch {
        // If getComputedStyle fails for some reason, just skip this element.
      }
      const scrollableY = (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight
      const scrollableX = (overflowX === "auto" || overflowX === "scroll") && el.scrollWidth > el.clientWidth
      if (scrollableY || scrollableX) return el
      el = el.parentElement
    }
    return null
  }, [])

  const getScrollPosition = useCallback(() => {
    const el = scrollElRef.current
    if (el) return { left: el.scrollLeft, top: el.scrollTop }
    return { left: window.scrollX, top: window.scrollY }
  }, [])

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDraggingRef.current) return

      const constraints = constraintsRef.current
      if (!constraints) return

      const { left: scrollLeft, top: scrollTop } = getScrollPosition()
      const scrollDx = scrollLeft - startScrollLeftRef.current
      const scrollDy = scrollTop - startScrollTopRef.current

      const dx = clientX - startClientXRef.current
      const dy = clientY - startClientYRef.current

      const rawX = startDragXRef.current + dx + scrollDx
      const rawY = startDragYRef.current + dy + scrollDy

      dragX.set(clamp(rawX, constraints.left, constraints.right))
      dragY.set(clamp(rawY, constraints.top, constraints.bottom))
    },
    [dragX, dragY, getScrollPosition],
  )

  const applyAutoScroll = useCallback(function applyAutoScrollLoop() {
    if (!isDraggingRef.current) return

    const vx = autoScrollVXRef.current
    const vy = autoScrollVYRef.current
    if (vx === 0 && vy === 0) return

    const scrollEl = scrollElRef.current

    try {
      if (scrollEl) {
        if (vx !== 0) scrollEl.scrollLeft += vx
        if (vy !== 0) scrollEl.scrollTop += vy
      } else {
        if (vx !== 0 || vy !== 0) window.scrollBy(vx, vy)
      }
    } catch {
      // Never let auto-scroll crash dragging.
    }

    // After scroll movement, recompute drag position for the latest pointer.
    updateFromPointer(lastClientXRef.current, lastClientYRef.current)

    autoScrollRafRef.current = requestAnimationFrame(applyAutoScrollLoop)
  }, [updateFromPointer])

  const updateAutoScrollVelocity = useCallback(
    (clientX: number, clientY: number) => {
      const scrollEl = scrollElRef.current

      let rectLeft = 0
      let rectTop = 0
      let rectRight = window.innerWidth
      let rectBottom = window.innerHeight

      if (scrollEl) {
        try {
          const r = scrollEl.getBoundingClientRect()
          rectLeft = r.left
          rectTop = r.top
          rectRight = r.right
          rectBottom = r.bottom
        } catch {
          // fall back to window rect
        }
      }

      const distTop = clientY - rectTop
      const distBottom = rectBottom - clientY
      const distLeft = clientX - rectLeft
      const distRight = rectRight - clientX

      const nextVY =
        distTop >= 0 && distTop < EDGE_SCROLL_THRESHOLD_PX
          ? -Math.round(EDGE_SCROLL_MAX_PX_PER_FRAME * (1 - distTop / EDGE_SCROLL_THRESHOLD_PX))
          : distBottom >= 0 && distBottom < EDGE_SCROLL_THRESHOLD_PX
            ? Math.round(EDGE_SCROLL_MAX_PX_PER_FRAME * (1 - distBottom / EDGE_SCROLL_THRESHOLD_PX))
            : 0

      const nextVX =
        distLeft >= 0 && distLeft < EDGE_SCROLL_THRESHOLD_PX
          ? -Math.round(EDGE_SCROLL_MAX_PX_PER_FRAME * (1 - distLeft / EDGE_SCROLL_THRESHOLD_PX))
          : distRight >= 0 && distRight < EDGE_SCROLL_THRESHOLD_PX
            ? Math.round(EDGE_SCROLL_MAX_PX_PER_FRAME * (1 - distRight / EDGE_SCROLL_THRESHOLD_PX))
            : 0

      autoScrollVXRef.current = nextVX
      autoScrollVYRef.current = nextVY

      const shouldRun = nextVX !== 0 || nextVY !== 0
      if (shouldRun && autoScrollRafRef.current === null) {
        autoScrollRafRef.current = requestAnimationFrame(applyAutoScroll)
      }

      if (!shouldRun && autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current)
        autoScrollRafRef.current = null
      }
    },
    [applyAutoScroll],
  )

  const commitDrag = useCallback(
    (element: HTMLElement) => {
      const container = boundsRef.current
      if (!container || !decorationId) {
        stopDragging()
        return
      }

      const containerRect = container.getBoundingClientRect()
      const elRect = element.getBoundingClientRect()

      const maxLeft = Math.max(0, containerRect.width - elRect.width)
      const maxTop = Math.max(0, containerRect.height - elRect.height)

      const leftPx = clamp(elRect.left - containerRect.left, 0, maxLeft)
      const topPx = clamp(elRect.top - containerRect.top, 0, maxTop)

      const leftPct = containerRect.width > 0 ? (leftPx / containerRect.width) * 100 : 0
      const topPct = containerRect.height > 0 ? (topPx / containerRect.height) * 100 : 0

      onCommit({
        top: `${topPct.toFixed(2)}%`,
        left: `${leftPct.toFixed(2)}%`,
        bottom: undefined,
        right: undefined,
      })

      dragX.set(0)
      dragY.set(0)
      stopDragging()
    },
    [boundsRef, decorationId, dragX, dragY, onCommit, stopDragging],
  )

  const startDrag = useCallback(
    (e: React.PointerEvent, element: HTMLElement) => {
      if (!decorationId) return

      // Reset any previous drag session
      stopDragging()

      const constraints = computeConstraints(element)
      if (!constraints) return
      constraintsRef.current = constraints

      activeElRef.current = element
      isDraggingRef.current = true
      pointerIdRef.current = e.pointerId

      // Capture pointer so movement continues outside the canvas.
      try {
        element.setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }

      const scrollEl = findScrollParent(element)
      scrollElRef.current = scrollEl

      const { left: startScrollLeft, top: startScrollTop } = scrollEl
        ? { left: scrollEl.scrollLeft, top: scrollEl.scrollTop }
        : { left: window.scrollX, top: window.scrollY }
      startScrollLeftRef.current = startScrollLeft
      startScrollTopRef.current = startScrollTop

      startClientXRef.current = e.clientX
      startClientYRef.current = e.clientY
      lastClientXRef.current = e.clientX
      lastClientYRef.current = e.clientY

      startDragXRef.current = dragX.get()
      startDragYRef.current = dragY.get()

      const onPointerMove = (ev: PointerEvent) => {
        if (!isDraggingRef.current) return
        if (pointerIdRef.current !== null && ev.pointerId !== pointerIdRef.current) return
        lastClientXRef.current = ev.clientX
        lastClientYRef.current = ev.clientY
        updateAutoScrollVelocity(ev.clientX, ev.clientY)
        updateFromPointer(ev.clientX, ev.clientY)
      }

      const onPointerUp = (ev: PointerEvent) => {
        if (pointerIdRef.current !== null && ev.pointerId !== pointerIdRef.current) return
        updateAutoScrollVelocity(0, 0)
        const activeEl = activeElRef.current
        if (activeEl) commitDrag(activeEl)
      }

      const onScroll = () => {
        if (!isDraggingRef.current) return
        updateFromPointer(lastClientXRef.current, lastClientYRef.current)
      }

      window.addEventListener("pointermove", onPointerMove, { passive: true })
      window.addEventListener("pointerup", onPointerUp)
      window.addEventListener("pointercancel", onPointerUp)
      window.addEventListener("scroll", onScroll, { passive: true })
      if (scrollEl) scrollEl.addEventListener("scroll", onScroll, { passive: true })

      cleanupRef.current = () => {
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("pointerup", onPointerUp)
        window.removeEventListener("pointercancel", onPointerUp)
        window.removeEventListener("scroll", onScroll)
        if (scrollEl) scrollEl.removeEventListener("scroll", onScroll)
      }

      // Initial placement
      updateAutoScrollVelocity(e.clientX, e.clientY)
      updateFromPointer(e.clientX, e.clientY)
    },
    [
      commitDrag,
      computeConstraints,
      decorationId,
      dragX,
      dragY,
      findScrollParent,
      stopDragging,
      updateAutoScrollVelocity,
      updateFromPointer,
    ],
  )

  return useMemo(
    () => ({
      dragX,
      dragY,
      startDrag,
      commitDrag,
    }),
    [dragX, dragY, startDrag, commitDrag],
  )
}
