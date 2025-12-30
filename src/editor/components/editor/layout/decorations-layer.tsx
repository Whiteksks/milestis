"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { DecorationElement } from '@/editor/lib/types'
import { useCallback, useMemo, useRef } from 'react'
import { useThemeStore, useUiStore } from '@/editor/lib/store'
import { DecorationsDndHandle } from '@/editor/components/editor/layout/decorations-dnd-handle'
import { useDecorationDnd } from '@/editor/hooks/use-decoration-dnd'
import { DecorationsFloatingMenu } from '@/editor/components/editor/layout/decorations-floating-menu'

interface DecorationsLayerProps {
  decorations: DecorationElement[]
  animation?: 'none' | 'fade' | 'slide-up' | 'slide-down' | string
}

const getAnimationVariants = (animation?: string) => {
  switch (animation) {
    case 'slide-up':
      return {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
      }
    case 'slide-down':
      return {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
      }
    case 'fade':
    case 'none':
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      }
  }
}

const getSizeClass = (size: string | undefined) => {
  switch (size) {
    case 'small':
      return 'w-[100px] h-[100px]'
    case 'medium':
      return 'w-[150px] h-[150px]'
    case 'large':
      return 'w-[200px] h-[200px]'
    case 'xlarge':
      return 'w-[300px] h-[300px]'
    default:
      return size || 'w-40 h-40'
  }
}

const getBaseSizePx = (size: string | undefined) => {
  switch (size) {
    case 'small':
      return 100
    case 'medium':
      return 150
    case 'large':
      return 200
    case 'xlarge':
      return 300
    default:
      return 160
  }
}

export function DecorationsLayer({ decorations, animation }: DecorationsLayerProps) {
  const animationVariants = getAnimationVariants(animation)

  const boundsRef = useRef<HTMLDivElement>(null)
  const { selectedDecorationId, deviceView } = useUiStore()
  const { updateDecoration, removeDecoration } = useThemeStore()

  const responsiveFactor = useMemo(() => {
    switch (deviceView) {
      case 'mobile':
        return 0.72
      case 'tablet':
        return 0.86
      case 'desktop':
      case 'fullscreen':
      default:
        return 1
    }
  }, [deviceView])

  const getSelectedElement = useCallback(() => {
    const container = boundsRef.current
    if (!container || !selectedDecorationId) return null
    return container.querySelector(`[data-decoration-id="${selectedDecorationId}"]`) as HTMLElement | null
  }, [selectedDecorationId])

  const selectedDecoration = useMemo(
    () => (selectedDecorationId ? decorations.find((d) => d.id === selectedDecorationId) : undefined),
    [decorations, selectedDecorationId],
  )

  const selectedDecorationSizePx = useMemo(() => {
    if (!selectedDecoration) return 0
    const baseScale = selectedDecoration.scale ?? 1
    const effectiveScale = (selectedDecoration.responsiveScale ? responsiveFactor : 1) * baseScale
    return Math.max(16, Math.round(getBaseSizePx(selectedDecoration.size) * effectiveScale))
  }, [responsiveFactor, selectedDecoration])

  const selectedDecorationMenuOffsets = useMemo(() => {
    if (!selectedDecorationSizePx) return { offsetX: 0, offsetY: 0 }
    return {
      // center under the decoration
      offsetX: selectedDecorationSizePx / 2,
      // below the decoration with a small gap
      offsetY: selectedDecorationSizePx + 12,
    }
  }, [selectedDecorationSizePx])

  const {
    dragControls,
    dragX,
    dragY,
    dragConstraints,
    startDragFromPointerEvent,
    commitDragPosition,
  } = useDecorationDnd({
    selectedDecorationId,
    boundsRef,
    getSelectedElement,
    onCommitPercentPosition: (id, position) => updateDecoration(id, { position }),
  })

  // IMPORTANT: keep this AFTER hooks.
  // React can throw an internal error when a component sometimes returns null
  // before running hooks (e.g. decorations.length === 0) and later starts
  // running hooks when data appears.
  if (!decorations.length) return null

  return (
    <>
      {/* Constraints wrapper (not interactive) */}
      <div ref={boundsRef} className="absolute inset-0 pointer-events-none">
        {decorations.map((decoration, index) => {
          const baseScale = decoration.scale ?? 1
          const effectiveScale = (decoration.responsiveScale ? responsiveFactor : 1) * baseScale

          return (
            <motion.div
            key={decoration.id || `decoration-${index}`}
            data-decoration-id={decoration.id || undefined}
            initial={animationVariants.initial}
            animate={
              decoration.id && decoration.id === selectedDecorationId
                ? { opacity: decoration.opacity }
                : { ...animationVariants.animate, opacity: decoration.opacity }
            }
            transition={{ duration: 0.8, delay: index * 0.15 }}
            className={cn(
              'absolute pointer-events-none',
              decoration.scale == null ? getSizeClass(decoration.size) : undefined,
            )}
            style={{
              top: decoration.position?.top || 'auto',
              bottom: decoration.position?.bottom || 'auto',
              left: decoration.position?.left || 'auto',
              right: decoration.position?.right || 'auto',
              zIndex: decoration.zIndex || 0,
              x: decoration.id && decoration.id === selectedDecorationId ? dragX : 0,
              y: decoration.id && decoration.id === selectedDecorationId ? dragY : 0,
              ...(decoration.scale != null
                ? {
                    width: `${Math.max(16, Math.round(getBaseSizePx(decoration.size) * effectiveScale))}px`,
                    height: `${Math.max(16, Math.round(getBaseSizePx(decoration.size) * effectiveScale))}px`,
                  }
                : null),
            }}
          >
            <img
              src={typeof decoration.image === 'string' && decoration.image ? decoration.image : '/placeholder.svg'}
              alt=""
              className="w-full h-full object-contain"
            />
          </motion.div>
          )
        })}
      </div>

      {/* Minimal DnD handle: only for selected custom decoration */}
      {selectedDecoration?.id ? (
        <>
          <DecorationsDndHandle
            decoration={selectedDecoration}
            sizePx={selectedDecorationSizePx}
            dragX={dragX}
            dragY={dragY}
            dragControls={dragControls}
            dragConstraints={dragConstraints}
            onStartDrag={startDragFromPointerEvent}
            onCommit={commitDragPosition}
          />

          <DecorationsFloatingMenu
            scale={selectedDecoration.scale ?? 1}
            onScaleChange={(next) => updateDecoration(selectedDecoration.id!, { scale: next })}
            onDelete={() => removeDecoration(selectedDecoration.id!)}
            anchor={selectedDecoration.position}
            x={dragX}
            y={dragY}
            offsetX={selectedDecorationMenuOffsets.offsetX}
            offsetY={selectedDecorationMenuOffsets.offsetY}
            className="-translate-x-1/2"
          />
        </>
      ) : null}
    </>
  )
}

export default DecorationsLayer
