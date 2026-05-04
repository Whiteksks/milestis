'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Area } from 'react-easy-crop'
import { getImageNaturalSize } from '@/editor/lib/crop-data'
import { setUserCrop, clearImageCrop } from '../editor/update-image-value'
import { parseImageRatio } from '../image-ratio'
import type { ImageRatioValue, ImageValue } from '../data'
import { pixelAreaToRect } from './pixel-to-rect'

export interface UseImageCropOptions {
  value: ImageValue
  /** The resolved ratio to crop against — from resolveImage or policy. */
  ratio: ImageRatioValue
  onApply: (next: ImageValue) => void
  onReset: (next: ImageValue) => void
}

export interface UseImageCropReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  isApplying: boolean
  /** react-easy-crop viewport position */
  cropPosition: { x: number; y: number }
  zoom: number
  aspectRatio: number
  /** Pass to ImageCropPanel → Cropper to restore the saved crop on open. */
  initialCroppedAreaPixels: Area | undefined
  setCropPosition: (v: { x: number; y: number }) => void
  setZoom: (v: number) => void
  onCropComplete: (_: Area, pixels: Area) => void
  handleApply: () => Promise<void>
  handleReset: () => void
  handleCancel: () => void
}

export function useImageCrop({
  value,
  ratio,
  onApply,
  onReset,
}: UseImageCropOptions): UseImageCropReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pendingArea, setPendingArea] = useState<Area | null>(null)
  const [initialCroppedAreaPixels, setInitialCroppedAreaPixels] = useState<Area | undefined>(undefined)

  const naturalSizeRef = useRef<{ width: number; height: number } | null>(null)
  const aspectRatio = parseImageRatio(ratio)

  // Pre-load natural dimensions as soon as an image src is available so they
  // are ready by the time the user opens the crop editor.
  useEffect(() => {
    if (!value.asset.src || naturalSizeRef.current) return
    getImageNaturalSize(value.asset.src)
      .then((size) => { naturalSizeRef.current = size })
      .catch(() => {})
  }, [value.asset.src])

  // Reset cached size when image changes
  useEffect(() => {
    naturalSizeRef.current = null
  }, [value.asset.src])

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setPendingArea(pixels)
  }, [])

  const handleApply = useCallback(async () => {
    if (!pendingArea) return
    try {
      setIsApplying(true)
      const size = naturalSizeRef.current ?? await getImageNaturalSize(value.asset.src)
      naturalSizeRef.current = size

      const { rect, focalPoint } = pixelAreaToRect(pendingArea, size.width, size.height)
      const next = setUserCrop(value, rect, ratio, focalPoint)
      onApply(next)
      setInitialCroppedAreaPixels(undefined)
      setIsOpen(false)
    } catch (e) {
      console.error('[useImageCrop] apply failed', e)
    } finally {
      setIsApplying(false)
    }
  }, [pendingArea, value, ratio, onApply])

  const handleReset = useCallback(() => {
    const next = clearImageCrop(value)
    onReset(next)
    setCropPosition({ x: 0, y: 0 })
    setZoom(1)
    setInitialCroppedAreaPixels(undefined)
    setIsOpen(false)
  }, [value, onReset])

  const handleCancel = useCallback(() => {
    setCropPosition({ x: 0, y: 0 })
    setZoom(1)
    setPendingArea(null)
    setInitialCroppedAreaPixels(undefined)
    setIsOpen(false)
  }, [])

  const open = useCallback(() => {
    setCropPosition({ x: 0, y: 0 })
    setZoom(1)
    setPendingArea(null)

    // Restore the previously saved crop so the user sees exactly what they
    // last applied rather than the default centered view.
    const userCrop = value.crop?.origin === 'user' ? value.crop : null
    const size = naturalSizeRef.current

    if (userCrop && size) {
      // Convert normalized rect (0–1) to pixels for react-easy-crop's
      // initialCroppedAreaPixels prop, which computes the correct zoom and
      // pan position internally via onZoomChange / onCropChange callbacks.
      setInitialCroppedAreaPixels({
        x: userCrop.rect.left * size.width,
        y: userCrop.rect.top * size.height,
        width: userCrop.rect.width * size.width,
        height: userCrop.rect.height * size.height,
      })
    } else {
      setInitialCroppedAreaPixels(undefined)
    }

    setIsOpen(true)
  }, [value.crop])

  return {
    isOpen,
    open,
    close: handleCancel,
    isApplying,
    cropPosition,
    zoom,
    aspectRatio,
    initialCroppedAreaPixels,
    setCropPosition,
    setZoom,
    onCropComplete,
    handleApply,
    handleReset,
    handleCancel,
  }
}
