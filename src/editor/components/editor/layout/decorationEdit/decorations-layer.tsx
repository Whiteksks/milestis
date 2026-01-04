"use client"

import { useCallback, useMemo } from 'react'
import type { DecorationElement as LegacyDecorationElement } from '@/editor/lib/types'
import { useThemeSelector, useUiSelector } from '@/editor/lib/store'
import {
  DecorationsLayer as OptimizedDecorationsLayer,
  type DecorationElement as OptimizedDecorationElement,
  type DecorationUpdatePayload,
} from '.'

interface DecorationsLayerProps {
  decorations: LegacyDecorationElement[]
  animation?: 'none' | 'fade' | 'slide-up' | 'slide-down' | string
}

const normalizeAnimation = (animation?: string): 'none' | 'fade' | 'slide-up' | 'slide-down' | undefined => {
  switch (animation) {
    case 'none':
    case 'fade':
    case 'slide-up':
    case 'slide-down':
      return animation
    default:
      return undefined
  }
}

export function DecorationsLayer({ decorations, animation }: DecorationsLayerProps) {
  const { selectedDecorationId, deviceView } = useUiSelector((state) => ({
    selectedDecorationId: state.selectedDecorationId,
    deviceView: state.deviceView,
  }))

  const { customDecorations, updateDecoration, removeDecoration } = useThemeSelector((state) => ({
    customDecorations: state.customDecorations,
    updateDecoration: state.updateDecoration,
    removeDecoration: state.removeDecoration,
  }))

  const editableIdSet = useMemo(() => new Set(customDecorations.map((d) => d.id)), [customDecorations])

  const optimizedDecorations: OptimizedDecorationElement[] = useMemo(
    () =>
      decorations.map((d, index) => ({
        id: d.id ?? `decoration-${index}`,
        image: d.image,
        position: d.position,
        size: (d.size as OptimizedDecorationElement['size']) ?? undefined,
        scale: d.scale,
        opacity: d.opacity,
        zIndex: d.zIndex,
        responsiveScale: d.responsiveScale,
        transform: d.transform,
        aspectRatio: d.aspectRatio,
      })),
    [decorations],
  )

  const selectedId = selectedDecorationId && editableIdSet.has(selectedDecorationId) ? selectedDecorationId : null

  const handleUpdate = useCallback(
    (id: string, updates: DecorationUpdatePayload) => {
      if (!editableIdSet.has(id)) return
      updateDecoration(id, updates as never)
    },
    [editableIdSet, updateDecoration],
  )

  const handleRemove = useCallback(
    (id: string) => {
      if (!editableIdSet.has(id)) return
      removeDecoration(id)
    },
    [editableIdSet, removeDecoration],
  )

  return (
    <OptimizedDecorationsLayer
      decorations={optimizedDecorations}
      selectedId={selectedId}
      deviceView={deviceView}
      animation={normalizeAnimation(animation)}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
    />
  )
}

export default DecorationsLayer
