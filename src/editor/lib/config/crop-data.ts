import type React from 'react'

export interface ImageCropArea {
  x: number
  y: number
  width: number
  height: number
}


export interface ImageCropData {
  /** react-easy-crop viewport position — restores the crop editor UI  */
  editorX: number
  editorY: number
  /** react-easy-crop zoom — restores the crop editor UI */
  zoom: number
  /** Pixel rect of the ORIGINAL image that should fill the display container */
  area: ImageCropArea
  /** Intrinsic pixel dimensions of the source image */
  naturalWidth: number
  naturalHeight: number
}

/**
 * Returns `position: absolute` styles for an inner image wrapper.
 */
export function getCropWrapperStyle(cropData: ImageCropData): React.CSSProperties {
  const { area, naturalWidth, naturalHeight } = cropData
  return {
    position: 'absolute',
    width:  `${(naturalWidth  / area.width)  * 100}%`,
    height: `${(naturalHeight / area.height) * 100}%`,
    left:   `${-(area.x / area.width)  * 100}%`,
    top:    `${-(area.y / area.height) * 100}%`,
  }
}

/** Load an image URL and return its intrinsic pixel dimensions. */
export function getImageNaturalSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = src
  })
}
