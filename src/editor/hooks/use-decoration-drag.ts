"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react"
import { useMotionValue } from "motion/react"
import type { DragBox, DecorationPosition } from "../components/editor/layout/decorationEdit/decorationTypes"
import { clamp } from "../components/editor/layout/decorationEdit/utils"

export interface UseDecorationDragOptions {
  decorationId: string | null
  /** Bounds container for drag constraints */
  boundsRef: RefObject<HTMLElement | null>
  /** Callback to commit position as percentages, optionally with the detected section anchor. */
  onCommit: (position: DecorationPosition, sectionId?: string) => void
  /**
   * Returns the registered canvas sections so commitDrag can detect which
   * section a decoration was dropped onto without traversing the DOM.
   * When omitted, section detection is skipped.
   */
  getSections?: () => Array<{ id: string; getRect: () => DOMRect | null }>
}

export interface UseDecorationDragReturn {
  dragX: ReturnType<typeof useMotionValue<number>>
  dragY: ReturnType<typeof useMotionValue<number>>
  startDrag: (e: React.PointerEvent, element: HTMLElement) => void
  commitDrag: (element: HTMLElement) => void
}

/** All mutable state for a single drag session. Null when not dragging. */
type DragSession = {
  constraints: DragBox
  activeEl: HTMLElement
  scrollEl: HTMLElement | null
  pointerId: number
  startClientX: number
  startClientY: number
  lastClientX: number
  lastClientY: number
  startDragX: number
  startDragY: number
  startScrollLeft: number
  startScrollTop: number
  autoScrollVX: number
  autoScrollVY: number
  autoScrollRafId: number | null
  abortController: AbortController
}

const EDGE_SCROLL_THRESHOLD_PX = 48
const EDGE_SCROLL_MAX_PX_PER_FRAME = 16

export function useDecorationDrag({ decorationId, boundsRef, onCommit, getSections }: UseDecorationDragOptions): UseDecorationDragReturn {
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)

  // Single ref that holds all per-session state.
  // null = not dragging; presence = active drag session.
  const dragSessionRef = useRef<DragSession | null>(null)

  const stopDragging = useCallback(() => {
    const session = dragSessionRef.current
    if (!session) return
    // Abort all event listeners registered with this session's signal.
    session.abortController.abort()
    if (session.autoScrollRafId !== null) {
      cancelAnimationFrame(session.autoScrollRafId)
    }
    dragSessionRef.current = null
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

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const session = dragSessionRef.current
      if (!session) return

      const { constraints, scrollEl, startClientX, startClientY, startDragX, startDragY, startScrollLeft, startScrollTop } = session

      const currentScrollLeft = scrollEl ? scrollEl.scrollLeft : window.scrollX
      const currentScrollTop = scrollEl ? scrollEl.scrollTop : window.scrollY
      const scrollDx = currentScrollLeft - startScrollLeft
      const scrollDy = currentScrollTop - startScrollTop

      const rawX = startDragX + (clientX - startClientX) + scrollDx
      const rawY = startDragY + (clientY - startClientY) + scrollDy

      dragX.set(clamp(rawX, constraints.left, constraints.right))
      dragY.set(clamp(rawY, constraints.top, constraints.bottom))
    },
    [dragX, dragY],
  )

  const applyAutoScroll = useCallback(function applyAutoScrollLoop() {
    const session = dragSessionRef.current
    if (!session) return

    const { autoScrollVX: vx, autoScrollVY: vy, scrollEl } = session
    if (vx === 0 && vy === 0) return

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
    updateFromPointer(session.lastClientX, session.lastClientY)

    session.autoScrollRafId = requestAnimationFrame(applyAutoScrollLoop)
  }, [updateFromPointer])

  const updateAutoScrollVelocity = useCallback(
    (clientX: number, clientY: number) => {
      const session = dragSessionRef.current
      if (!session) return

      const { scrollEl } = session

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

      session.autoScrollVX = nextVX
      session.autoScrollVY = nextVY

      const shouldRun = nextVX !== 0 || nextVY !== 0
      if (shouldRun && session.autoScrollRafId === null) {
        session.autoScrollRafId = requestAnimationFrame(applyAutoScroll)
      }
      if (!shouldRun && session.autoScrollRafId !== null) {
        cancelAnimationFrame(session.autoScrollRafId)
        session.autoScrollRafId = null
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

      // Detect section the decoration was dropped onto (metadata only).
      let detectedSectionId: string | undefined

      if (getSections) {
        const rawTop = elRect.top - containerRect.top
        for (const { id, getRect } of getSections()) {
          const sectionRect = getRect()
          if (!sectionRect) continue
          const sectionTop = sectionRect.top - containerRect.top
          const sectionBottom = sectionRect.bottom - containerRect.top
          if (rawTop >= sectionTop - 1 && rawTop < sectionBottom) {
            detectedSectionId = id
            break
          }
        }
      }

      // Store the CENTER of the element as canvas-root %.
      // DraggableDecoration renders with calc(X% - size/2), so the visual
      // center stays at the stored percentage across all canvas widths.
      const rawLeft = elRect.left - containerRect.left
      const rawTop = elRect.top - containerRect.top
      const centerLeftPct =
        containerRect.width > 0
          ? ((rawLeft + elRect.width / 2) / containerRect.width) * 100
          : 0
      const centerTopPct =
        containerRect.height > 0
          ? ((rawTop + elRect.height / 2) / containerRect.height) * 100
          : 0
      onCommit(
        { top: `${centerTopPct.toFixed(2)}%`, left: `${centerLeftPct.toFixed(2)}%`, bottom: undefined, right: undefined },
        detectedSectionId,
      )

      dragX.set(0)
      dragY.set(0)
      stopDragging()
    },
    [boundsRef, decorationId, dragX, dragY, getSections, onCommit, stopDragging],
  )

  const startDrag = useCallback(
    (e: React.PointerEvent, element: HTMLElement) => {
      if (!decorationId) return

      // Cancel any previous drag session before starting a new one.
      stopDragging()

      const constraints = computeConstraints(element)
      if (!constraints) return

      // Capture pointer so movement continues outside the canvas.
      try {
        element.setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }

      const scrollEl = findScrollParent(element)
      const startScrollLeft = scrollEl ? scrollEl.scrollLeft : window.scrollX
      const startScrollTop = scrollEl ? scrollEl.scrollTop : window.scrollY

      const ac = new AbortController()
      const { signal } = ac

      const session: DragSession = {
        constraints,
        activeEl: element,
        scrollEl,
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        lastClientX: e.clientX,
        lastClientY: e.clientY,
        startDragX: dragX.get(),
        startDragY: dragY.get(),
        startScrollLeft,
        startScrollTop,
        autoScrollVX: 0,
        autoScrollVY: 0,
        autoScrollRafId: null,
        abortController: ac,
      }

      dragSessionRef.current = session

      window.addEventListener("pointermove", (ev: PointerEvent) => {
        const s = dragSessionRef.current
        if (!s || ev.pointerId !== s.pointerId) return
        s.lastClientX = ev.clientX
        s.lastClientY = ev.clientY
        updateAutoScrollVelocity(ev.clientX, ev.clientY)
        updateFromPointer(ev.clientX, ev.clientY)
      }, { passive: true, signal })

      const onPointerUp = (ev: PointerEvent) => {
        const s = dragSessionRef.current
        if (!s || ev.pointerId !== s.pointerId) return
        updateAutoScrollVelocity(0, 0)
        commitDrag(s.activeEl)
      }
      window.addEventListener("pointerup", onPointerUp, { signal })
      window.addEventListener("pointercancel", onPointerUp, { signal })

      const onScroll = () => {
        const s = dragSessionRef.current
        if (!s) return
        updateFromPointer(s.lastClientX, s.lastClientY)
      }
      window.addEventListener("scroll", onScroll, { passive: true, signal })
      if (scrollEl) scrollEl.addEventListener("scroll", onScroll, { passive: true, signal })

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
