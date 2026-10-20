"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function useVisualViewportPadding() {
  const [viewportState, setViewportState] = React.useState(() => {
    if (typeof window === "undefined") {
      return {
        top: 12,
        right: 12,
        bottom: 12,
        left: 12,
        maxHeight: undefined as number | undefined,
      }
    }

    const visualViewport = window.visualViewport
    const offsetTop = visualViewport?.offsetTop ?? 0
    const viewportHeight = visualViewport?.height ?? window.innerHeight
    const visibleBottom = offsetTop + viewportHeight
    const obscuredBottom = Math.max(0, window.innerHeight - visibleBottom)

    return {
      top: Math.max(12, Math.round(offsetTop) + 12),
      right: 12,
      bottom: Math.max(12, Math.round(obscuredBottom) + 12),
      left: 12,
      maxHeight: Math.max(160, Math.round(viewportHeight) - 24),
    }
  })

  React.useEffect(() => {
    if (typeof window === "undefined") return

    let frameId: number | null = null

    const updateViewportState = () => {
      frameId = null

      const visualViewport = window.visualViewport
      const offsetTop = visualViewport?.offsetTop ?? 0
      const viewportHeight = visualViewport?.height ?? window.innerHeight
      const visibleBottom = offsetTop + viewportHeight
      const obscuredBottom = Math.max(0, window.innerHeight - visibleBottom)

      setViewportState({
        top: Math.max(12, Math.round(offsetTop) + 12),
        right: 12,
        bottom: Math.max(12, Math.round(obscuredBottom) + 12),
        left: 12,
        maxHeight: Math.max(160, Math.round(viewportHeight) - 24),
      })
    }

    const scheduleUpdate = () => {
      if (frameId !== null) return
      frameId = window.requestAnimationFrame(updateViewportState)
    }

    scheduleUpdate()

    const visualViewport = window.visualViewport
    window.addEventListener("resize", scheduleUpdate)
    window.addEventListener("orientationchange", scheduleUpdate)
    visualViewport?.addEventListener("resize", scheduleUpdate)
    visualViewport?.addEventListener("scroll", scheduleUpdate)

    return () => {
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("orientationchange", scheduleUpdate)
      visualViewport?.removeEventListener("resize", scheduleUpdate)
      visualViewport?.removeEventListener("scroll", scheduleUpdate)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return viewportState
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  collisionPadding,
  style,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const viewportPadding = useVisualViewportPadding()
  const resolvedCollisionPadding = typeof collisionPadding === "number"
    ? {
        top: Math.max(collisionPadding, viewportPadding.top),
        right: Math.max(collisionPadding, viewportPadding.right),
        bottom: Math.max(collisionPadding, viewportPadding.bottom),
        left: Math.max(collisionPadding, viewportPadding.left),
      }
    : {
        top: Math.max(collisionPadding?.top ?? 0, viewportPadding.top),
        right: Math.max(collisionPadding?.right ?? 0, viewportPadding.right),
        bottom: Math.max(collisionPadding?.bottom ?? 0, viewportPadding.bottom),
        left: Math.max(collisionPadding?.left ?? 0, viewportPadding.left),
      }

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={resolvedCollisionPadding}
        className={cn(
        "z-50 w-72 max-h-[var(--popover-available-height)] overflow-y-auto overscroll-contain rounded-md border bg-popover p-4 text-popover-foreground md:shadow-md outline-none will-change-[transform,opacity] transform-gpu data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 duration-100",
        className
        )}
        style={{
          ...style,
          ["--popover-available-height" as string]: viewportPadding.maxHeight
            ? `${viewportPadding.maxHeight}px`
            : undefined,
          maxHeight: viewportPadding.maxHeight
            ? `${viewportPadding.maxHeight}px`
            : style?.maxHeight,
        }}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
