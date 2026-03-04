"use client"

import { useCallback, useRef, useState } from "react"
import type { Area } from "react-easy-crop"
import type { ImageCropData } from "@/editor/lib/crop-data"
import { getImageNaturalSize } from "@/editor/lib/crop-data"

export interface UseCropOptions {
  /** Current source image URL. */
  image: string
  /** Previously saved crop — used to restore editor position/zoom. */
  cropData?: ImageCropData
}

export interface UseCropReturn {
  showCrop: boolean
  setShowCrop: (v: boolean) => void
  isApplying: boolean
  crop: { x: number; y: number }
  setCrop: (v: { x: number; y: number }) => void
  zoom: number
  setZoom: (v: number) => void
  onCropComplete: (_: Area, pixels: Area) => void
  handleReset: () => void
  /**
   * Computes the ImageCropData from the current crop selection.
   * Returns null when no area is selected or on error.
   * The caller is responsible for persisting the result.
   */
  handleApply: () => Promise<ImageCropData | null>
  /**
   * Original (unmodified) image URL used by the Cropper.
   * Always points to the source — never to a blob.
   */
  readonly originalImage: string
  /**
   * Call this whenever the source image URL changes externally.
   * Resets all local crop state to defaults.
   */
  syncImage: (newImage: string) => void
}

export function useCrop({ image, cropData }: UseCropOptions): UseCropReturn {
  const [showCrop, setShowCrop] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [crop, setCrop] = useState<{ x: number; y: number }>({
    x: cropData?.editorX ?? 0,
    y: cropData?.editorY ?? 0,
  })
  const [zoom, setZoom] = useState(cropData?.zoom ?? 1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  // Always reference the original, unmodified image URL
  const originalImageRef = useRef<string>(image)

  const syncImage = useCallback((newImage: string) => {
    originalImageRef.current = newImage
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setShowCrop(false)
  }, [])

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const handleApply = async (): Promise<ImageCropData | null> => {
    if (!croppedAreaPixels) return null
    try {
      setIsApplying(true)
      const src = originalImageRef.current || image
      const { width: naturalWidth, height: naturalHeight } = await getImageNaturalSize(src)
      return {
        editorX: crop.x,
        editorY: crop.y,
        zoom,
        area: croppedAreaPixels,
        naturalWidth,
        naturalHeight,
      }
    } catch (e) {
      console.error(e)
      return null
    } finally {
      setIsApplying(false)
    }
  }

  return {
    showCrop,
    setShowCrop,
    isApplying,
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    handleReset,
    handleApply,
    get originalImage() { return originalImageRef.current },
    syncImage,
  }
}
