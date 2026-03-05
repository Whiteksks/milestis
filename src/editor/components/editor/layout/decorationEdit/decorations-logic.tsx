"use client"

import { useCallback, useMemo, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { DecorationElement, DecorationUpdatePayload } from "./decorationTypes"
import type { DeviceView } from "@/editor/lib/types"
import { getResponsiveFactor, loadImageAspectRatio } from "./utils"
import { useDecorationDrag } from "../../../../hooks/use-decoration-drag"
import { DraggableDecoration } from "./draggable-decoration"
import { DecorationHandle } from "./decoration-handle"
import { getDecorationAnimationVariants, type DecorationAnimation } from "@/editor/lib/decoration-animations"

export interface DecorationsLayerProps {
  decorations: DecorationElement[]
  selectedId: string | null
  deviceView?: DeviceView
  animation?: DecorationAnimation
  onUpdate: (id: string, updates: DecorationUpdatePayload) => void
  onRemove: (id: string) => void
  onSelect?: (id: string | null) => void
  className?: string
}

export function DecorationsLayer({
  decorations,
  selectedId,
  deviceView = "desktop" as DeviceView,
  animation,
  onUpdate,
  onRemove,
  onSelect,
  className,
}: DecorationsLayerProps) {
  const boundsRef = useRef<HTMLDivElement>(null)
  const animationVariants = getDecorationAnimationVariants(animation)
  const responsiveFactor = getResponsiveFactor(deviceView)

  const selectedDecoration = useMemo(() => decorations.find((d) => d.id === selectedId), [decorations, selectedId])

  const handleCommitPosition = useCallback(
    (position: DecorationElement["position"]) => {
      if (selectedId) onUpdate(selectedId, { position })
    },
    [selectedId, onUpdate],
  )

  const { dragX, dragY, startDrag } = useDecorationDrag({
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

  const handleCanvasSelect = useCallback(
    (id: string | null) => {
      onSelect?.(id)
    },
    [onSelect],
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
            onClick={(id) => handleCanvasSelect(id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedDecoration && (
          <DecorationHandle
            decoration={selectedDecoration}
            responsiveFactor={responsiveFactor}
            dragX={dragX}
            dragY={dragY}
            onStartDrag={startDrag}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default DecorationsLayer
