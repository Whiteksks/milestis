"use client"

import { useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import type { DecorationElement, DecorationUpdatePayload } from "./decorationTypes"
import type { DeviceView } from "@/editor/lib/types"
import { getResponsiveFactor } from "./utils"
import { useDecorationDrag } from "../../../../hooks/use-decoration-drag"
import { DraggableDecoration } from "./draggable-decoration"
import { getDecorationAnimationVariants, type DecorationAnimation } from "@/editor/lib/config/decoration-animations"
import { useSectionRegistry } from "@/editor/lib/section-registry-context"

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
  onSelect,
  className,
}: DecorationsLayerProps) {
  const boundsRef = useRef<HTMLDivElement>(null)
  const animationVariants = getDecorationAnimationVariants(animation)
  const responsiveFactor = getResponsiveFactor(deviceView)
  const registry = useSectionRegistry()

  const handleCommitPosition = useCallback(
    (position: DecorationElement["position"], sectionId?: string) => {
      if (selectedId) onUpdate(selectedId, { position, sectionId })
    },
    [selectedId, onUpdate],
  )

  const { dragX, dragY, startDrag } = useDecorationDrag({
    decorationId: selectedId,
    boundsRef,
    onCommit: handleCommitPosition,
    getSections: registry?.getSections,
  })

  const handleCanvasSelect = useCallback(
    (id: string | null) => {
      onSelect?.(id)
    },
    [onSelect],
  )

  if (!decorations.length) return null

  return (
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
          onStartDrag={decoration.id === selectedId ? startDrag : undefined}
        />
      ))}
    </div>
  )
}

export default DecorationsLayer
