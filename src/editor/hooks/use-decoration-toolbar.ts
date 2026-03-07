import { useCallback } from "react"
import type { DecorationElement } from "../components/editor/layout/decorationEdit/decorationTypes"
import { clamp, round2 } from "../components/editor/layout/decorationEdit/utils"

const MIN_SCALE = 0.5
const MAX_SCALE = 3

export interface UseDecorationToolbarProps {
  decoration?: DecorationElement
  onUpdate?: (updates: Partial<DecorationElement>) => void
  onImageReplace?: (file: File) => void
  onActiveDecorationChange: (id: string) => void
  onSelectDecoration?: (id: string) => void
}

export function useDecorationToolbar({
  decoration,
  onUpdate,
  onImageReplace,
  onActiveDecorationChange,
  onSelectDecoration,
}: UseDecorationToolbarProps) {
  const isExpanded = Boolean(decoration)

  const {
    scale = 1,
    opacity = 1,
    zIndex = 0,
    responsiveScale = false,
    transform,
  } = decoration ?? {}

  const normalizedScale = Number.isFinite(scale) ? scale : 1
  const normalizedOpacity = Number.isFinite(opacity) ? opacity : 1
  const scalePercent = Math.round(clamp(normalizedScale, MIN_SCALE, MAX_SCALE) * 100)
  const opacityPercent = Math.round(clamp(normalizedOpacity, 0, 1) * 100)
  const isFront = zIndex >= 20

  const toggleFlipX = useCallback(() => {
    onUpdate?.({ transform: { ...transform, flipX: !transform?.flipX } })
  }, [transform, onUpdate])

  const toggleFlipY = useCallback(() => {
    onUpdate?.({ transform: { ...transform, flipY: !transform?.flipY } })
  }, [transform, onUpdate])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onImageReplace?.(file)
      e.currentTarget.value = ""
    },
    [onImageReplace],
  )

  const handleDecorationPick = useCallback(
    (id: string) => {
      onActiveDecorationChange(id)
      onSelectDecoration?.(id)
    },
    [onActiveDecorationChange, onSelectDecoration],
  )

  const handleScaleChange = useCallback(
    (value: number) => {
      onUpdate?.({
        scale: round2(clamp(value / 100, MIN_SCALE, MAX_SCALE)),
      })
    },
    [onUpdate],
  )

  const handleOpacityChange = useCallback(
    (value: number) => {
      onUpdate?.({ opacity: round2(clamp(value / 100, 0, 1)) })
    },
    [onUpdate],
  )

  const toggleZIndex = useCallback(() => {
    onUpdate?.({ zIndex: isFront ? 5 : 20 })
  }, [isFront, onUpdate])

  const handleResponsiveScaleChange = useCallback(
    (checked: boolean) => {
      onUpdate?.({ responsiveScale: checked })
    },
    [onUpdate],
  )

  const handleAnchorPositionChange = useCallback(
    (checked: boolean) => {
      onUpdate?.({ anchorPosition: checked })
    },
    [onUpdate],
  )

  return {
    isExpanded,
    scalePercent,
    opacityPercent,
    isFront,
    responsiveScale,
    toggleFlipX,
    toggleFlipY,
    handleFileChange,
    handleDecorationPick,
    handleScaleChange,
    handleOpacityChange,
    toggleZIndex,
    handleResponsiveScaleChange,
  }
}
