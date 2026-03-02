import type React from 'react'

export interface ImageCropArea {
  x: number
  y: number
  width: number
  height: number
}

/**
 * All data required to reproduce a crop visually using pure CSS —
 * no canvas / blob needed.
 */
export interface ImageCropData {
  /** react-easy-crop viewport position — restores the crop editor UI  */
  editorX: number
  editorY: number
  /** react-easy-crop zoom — restores the crop editor UI */
  zoom: number
  /** Pixel rect of the ORIGINAL image that should fill the display container */
  area: ImageCropArea
  /** Intrinsic (natural) pixel dimensions of the source image */
  naturalWidth: number
  naturalHeight: number
}

/**
 * Returns `position: absolute` styles for an inner image wrapper so that
 * exactly `cropData.area` of the source image is visible inside a container
 * whose size / aspect-ratio matches that area.
 *
 * Usage:
 *   <div style={{ position:'relative', overflow:'hidden', width:'100%',
 *                 aspectRatio:`${area.width}/${area.height}` }}>
 *     <div style={getCropWrapperStyle(cropData)}>
 *       <Image fill src={src} style={{ objectFit:'fill' }} />
 *     </div>
 *   </div>
 *
 * Math:
 *   scale = containerWidth / area.width
 *   imageWidthPx  = naturalWidth  * scale  →  as % of containerWidth  = naturalWidth  / area.width  * 100
 *   imageHeightPx = naturalHeight * scale  →  as % of containerHeight = naturalHeight / area.height * 100
 *   leftOffsetPx  = -area.x * scale        →  as % of containerWidth  = -area.x / area.width  * 100
 *   topOffsetPx   = -area.y * scale        →  as % of containerHeight = -area.y / area.height * 100
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
    img.crossOrigin = 'anonymous'
    img.src = src
  })
}
