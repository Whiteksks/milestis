"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls } from "framer-motion"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

const SNAP_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.9,
  restDelta: 0.5,
  restSpeed: 2,
}

const RESISTANCE_FACTOR = 0.14
const SWIPE_VELOCITY_THRESHOLD = 0.35
const SWIPE_VELOCITY_PROJECTION = 180

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function applyResistance(value: number, min: number, max: number) {
  if (value < min) return min - (min - value) * RESISTANCE_FACTOR
  if (value > max) return max + (value - max) * RESISTANCE_FACTOR
  return value
}

function findNearestSnapIndex(value: number, snapHeights: readonly number[]) {
  let bestIndex = 0
  let bestDistance = Number.POSITIVE_INFINITY

  for (let index = 0; index < snapHeights.length; index += 1) {
    const distance = Math.abs(snapHeights[index] - value)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = index
    }
  }

  return bestIndex
}

function normalizeSnapHeights(snapHeights: readonly number[]) {
  return snapHeights.reduce<number[]>((accumulator, height, index) => {
    const previousHeight = accumulator[index - 1] ?? 0
    accumulator.push(Math.max(previousHeight, Math.max(0, height)))
    return accumulator
  }, [])
}

interface DragSession {
  pointerId: number
  startY: number
  lastY: number
  lastTime: number
  velocity: number
  startHeight: number
}

export interface MobileSnapSheetRenderProps {
  dragHandleProps: HTMLAttributes<HTMLDivElement>
}

interface MobileSnapSheetProps {
  open?: boolean
  snapHeights: readonly number[]
  snapIndex: number
  onSnapIndexChange: (snapIndex: number) => void
  className?: string
  ariaLabel?: string
  children: (props: MobileSnapSheetRenderProps) => ReactNode
}

export function MobileSnapSheet({
  open = true,
  snapHeights,
  snapIndex,
  onSnapIndexChange,
  className,
  ariaLabel,
  children,
}: MobileSnapSheetProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const resolvedSnapHeights = useMemo(() => normalizeSnapHeights(snapHeights), [snapHeights])
  const lastSnapIndex = Math.max(0, resolvedSnapHeights.length - 1)
  const safeSnapIndex = clamp(snapIndex, 0, lastSnapIndex)
  const minSnapHeight = resolvedSnapHeights[0] ?? 0
  const maxSnapHeight = resolvedSnapHeights[lastSnapIndex] ?? minSnapHeight
  const targetHeight = resolvedSnapHeights[safeSnapIndex] ?? minSnapHeight

  const sheetHeight = useMotionValue(targetHeight)
  const animationRef = useRef<AnimationPlaybackControls | null>(null)
  const dragSessionRef = useRef<DragSession | null>(null)

  const stopAnimation = useCallback(() => {
    animationRef.current?.stop()
    animationRef.current = null
  }, [])

  const animateToHeight = useCallback(
    (nextHeight: number) => {
      const currentHeight = sheetHeight.get()

      if (Math.abs(currentHeight - nextHeight) < 0.5) {
        stopAnimation()
        sheetHeight.set(nextHeight)
        return
      }

      stopAnimation()
      animationRef.current = animate(sheetHeight, nextHeight, SNAP_SPRING)
    },
    [sheetHeight, stopAnimation],
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    return () => {
      stopAnimation()
    }
  }, [stopAnimation])

  useEffect(() => {
    if (!isMounted || !open || isDragging) return
    animateToHeight(targetHeight)
  }, [animateToHeight, isDragging, isMounted, open, targetHeight])

  const finalizeDrag = useCallback(
    (pointerId: number) => {
      const dragSession = dragSessionRef.current
      if (!dragSession || dragSession.pointerId !== pointerId) return

      dragSessionRef.current = null
      setIsDragging(false)

      const currentHeight = clamp(sheetHeight.get(), minSnapHeight, maxSnapHeight)
      const nearestSnapIndex = findNearestSnapIndex(currentHeight, resolvedSnapHeights)

      const nextSnapIndex = Math.abs(dragSession.velocity) >= SWIPE_VELOCITY_THRESHOLD
        ? clamp(
          findNearestSnapIndex(
            clamp(
              currentHeight - dragSession.velocity * SWIPE_VELOCITY_PROJECTION,
              minSnapHeight,
              maxSnapHeight,
            ),
            resolvedSnapHeights,
          ),
          Math.max(0, nearestSnapIndex - 1),
          Math.min(lastSnapIndex, nearestSnapIndex + 1),
        )
        : nearestSnapIndex

      const nextHeight = resolvedSnapHeights[nextSnapIndex] ?? currentHeight
      animateToHeight(nextHeight)

      if (nextSnapIndex !== safeSnapIndex) {
        onSnapIndexChange(nextSnapIndex)
      }
    },
    [
      animateToHeight,
      lastSnapIndex,
      maxSnapHeight,
      minSnapHeight,
      onSnapIndexChange,
      resolvedSnapHeights,
      safeSnapIndex,
      sheetHeight,
    ],
  )

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return

      event.preventDefault()
      event.stopPropagation()

      stopAnimation()
      setIsDragging(true)

      dragSessionRef.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        lastY: event.clientY,
        lastTime: event.timeStamp,
        velocity: 0,
        startHeight: sheetHeight.get() || targetHeight,
      }

      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [sheetHeight, stopAnimation, targetHeight],
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const dragSession = dragSessionRef.current
      if (!dragSession || dragSession.pointerId !== event.pointerId) return

      const deltaY = event.clientY - dragSession.startY
      const nextHeight = applyResistance(dragSession.startHeight - deltaY, minSnapHeight, maxSnapHeight)

      sheetHeight.set(nextHeight)

      const deltaTime = Math.max(event.timeStamp - dragSession.lastTime, 1)
      dragSession.velocity = (event.clientY - dragSession.lastY) / deltaTime
      dragSession.lastY = event.clientY
      dragSession.lastTime = event.timeStamp
    },
    [maxSnapHeight, minSnapHeight, sheetHeight],
  )

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (dragSessionRef.current?.pointerId !== event.pointerId) return

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      finalizeDrag(event.pointerId)
    },
    [finalizeDrag],
  )

  const handlePointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (dragSessionRef.current?.pointerId !== event.pointerId) return

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      finalizeDrag(event.pointerId)
    },
    [finalizeDrag],
  )

  const handleLostPointerCapture = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (dragSessionRef.current?.pointerId !== event.pointerId) return
      finalizeDrag(event.pointerId)
    },
    [finalizeDrag],
  )

  const dragHandleProps = useMemo<HTMLAttributes<HTMLDivElement>>(
    () => ({
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onLostPointerCapture: handleLostPointerCapture,
    }),
    [handleLostPointerCapture, handlePointerCancel, handlePointerDown, handlePointerMove, handlePointerUp],
  )

  const sheetOffset = useTransform(sheetHeight, (value) => Math.max(0, maxSnapHeight - value))

  if (!isMounted || !open) return null

  return createPortal(
    <motion.div
      aria-label={ariaLabel}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden pointer-events-auto md:hidden",
        className,
      )}
      style={{
        height: maxSnapHeight,
        maxHeight: maxSnapHeight,
        willChange: "transform",
        y: sheetOffset,
      }}
    >
      {children({ dragHandleProps })}
    </motion.div>,
    document.body,
  )
}