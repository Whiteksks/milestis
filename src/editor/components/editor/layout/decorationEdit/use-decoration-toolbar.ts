import { useRef, useCallback, useState, useEffect } from "react"
import type { DecorationElement } from "./decorationTypes"
import { clamp, round2 } from "./utils"

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
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const [scaleText, setScaleText] = useState("100")

  useEffect(() => {
    setScaleText(String(Math.round(normalizedScale * 100)))
  }, [normalizedScale])

  const commitScale = useCallback(() => {
    const raw = scaleText.replace(",", ".").trim()
    const percent = Number(raw)
    if (!Number.isFinite(percent)) {
      setScaleText(String(Math.round(normalizedScale * 100)))
      return
    }

    onUpdate?.({
      scale: round2(clamp(percent / 100, MIN_SCALE, MAX_SCALE)),
    })
  }, [scaleText, normalizedScale, onUpdate])

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

  return {
    fileInputRef,
    isExpanded,
    normalizedScale,
    normalizedOpacity,
    scalePercent,
    opacityPercent,
    isFront,
    responsiveScale,
    scaleText,
    setScaleText,
    commitScale,
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
