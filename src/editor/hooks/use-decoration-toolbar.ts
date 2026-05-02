import type { DecorationElement } from "../components/editor/layout/decorationEdit/decorationTypes"
import { clamp, round2 } from "../components/editor/layout/decorationEdit/utils"

const MIN_SCALE = 0.5
const MAX_SCALE = 3

export interface UseDecorationToolbarProps {
  decoration?: DecorationElement
  onUpdate?: (updates: Partial<DecorationElement>) => void
  onActiveDecorationChange: (id: string) => void
  onSelectDecoration?: (id: string) => void
}

export function useDecorationToolbar({
  decoration,
  onUpdate,
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

  const toggleFlipX = () => {
    onUpdate?.({ transform: { ...transform, flipX: !transform?.flipX } })
  }

  const toggleFlipY = () => {
    onUpdate?.({ transform: { ...transform, flipY: !transform?.flipY } })
  }

  const handleDecorationPick = (id: string) => {
    onActiveDecorationChange(id)
    onSelectDecoration?.(id)
  }

  const handleScaleChange = (value: number) => {
    onUpdate?.({
      scale: round2(clamp(value / 100, MIN_SCALE, MAX_SCALE)),
    })
  }

  const handleOpacityChange = (value: number) => {
    onUpdate?.({ opacity: round2(clamp(value / 100, 0, 1)) })
  }

  const toggleZIndex = () => {
    onUpdate?.({ zIndex: isFront ? 5 : 20 })
  }

  const handleResponsiveScaleChange = (checked: boolean) => {
    onUpdate?.({ responsiveScale: checked })
  }

  return {
    isExpanded,
    scalePercent,
    opacityPercent,
    isFront,
    responsiveScale,
    toggleFlipX,
    toggleFlipY,
    handleDecorationPick,
    handleScaleChange,
    handleOpacityChange,
    toggleZIndex,
    handleResponsiveScaleChange,
  }
}
