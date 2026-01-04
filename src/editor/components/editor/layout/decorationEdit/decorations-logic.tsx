"use client"

import { useCallback, useMemo, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { DecorationElement, DecorationUpdatePayload } from "./decorationTypes"
import { getResponsiveFactor, loadImageAspectRatio } from "./utils"
import { useDecorationDrag } from "../../../../hooks/use-decoration-drag"
import { DraggableDecoration } from "./draggable-decoration"
import { DecorationHandle } from "./decoration-handle"
import { DecorationToolbar } from "./decoration-toolbar"

const getAnimationVariants = (animation?: string) => {
  switch (animation) {
    case "slide-up":
      return { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }
    case "slide-down":
      return { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } }
    case "fade":
    default:
      return { initial: { opacity: 0 }, animate: { opacity: 1 } }
  }
}

export interface DecorationsLayerProps {
  decorations: DecorationElement[]
  selectedId: string | null
  deviceView?: "mobile" | "tablet" | "desktop" | "fullscreen"
  animation?: "none" | "fade" | "slide-up" | "slide-down"
  onUpdate: (id: string, updates: DecorationUpdatePayload) => void
  onRemove: (id: string) => void
  onSelect?: (id: string | null) => void
  className?: string
}

export function DecorationsLayer({
  decorations,
  selectedId,
  deviceView = "desktop",
  animation,
  onUpdate,
  onRemove,
  onSelect,
  className,
}: DecorationsLayerProps) {
  const boundsRef = useRef<HTMLDivElement>(null)
  const animationVariants = getAnimationVariants(animation)
  const responsiveFactor = getResponsiveFactor(deviceView)

  const selectedDecoration = useMemo(() => decorations.find((d) => d.id === selectedId), [decorations, selectedId])

  const handleCommitPosition = useCallback(
    (position: DecorationElement["position"]) => {
      if (selectedId) onUpdate(selectedId, { position })
    },
    [selectedId, onUpdate],
  )

  const { dragControls, dragX, dragY, constraints, startDrag, commitDrag } = useDecorationDrag({
    decorationId: selectedId,
    boundsRef,
    onCommit: handleCommitPosition,
  })

  const handleImageReplace = useCallback(
    async (file: File) => {
      if (!selectedId) return
      const url = URL.createObjectURL(file)
      const aspectRatio = await loadImageAspectRatio(url)
      onUpdate(selectedId, { image: url, aspectRatio })
    },
    [selectedId, onUpdate],
  )

  if (!decorations.length) return null

  return (
    <>
      <div ref={boundsRef} className={cn("absolute inset-0 pointer-events-none", className)}>
        {decorations.map((decoration, index) => (
          <DraggableDecoration
            key={decoration.id}
            decoration={decoration}
            isSelected={decoration.id === selectedId}
            responsiveFactor={responsiveFactor}
            dragX={decoration.id === selectedId ? dragX : undefined}
            dragY={decoration.id === selectedId ? dragY : undefined}
            animationVariants={animationVariants}
            animationDelay={index * 0.15}
            onClick={onSelect}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedDecoration && (
          <>
            <DecorationHandle
              decoration={selectedDecoration}
              responsiveFactor={responsiveFactor}
              dragX={dragX}
              dragY={dragY}
              dragControls={dragControls}
              constraints={constraints}
              onStartDrag={startDrag}
              onCommitDrag={commitDrag}
            />

            <DecorationToolbar
              decoration={selectedDecoration}
              onUpdate={(updates) => onUpdate(selectedDecoration.id, updates)}
              onDelete={() => onRemove(selectedDecoration.id)}
              onImageReplace={handleImageReplace}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default DecorationsLayer
