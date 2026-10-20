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

/** Load an image URL and return its intrinsic pixel dimensions. */
export function getImageNaturalSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = src
  })
}
