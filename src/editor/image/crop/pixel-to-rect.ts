import type { Area } from 'react-easy-crop'
import type { ImageCropRect, ImageFocalPoint } from '../data'

/**
 * Converts the pixel area returned by react-easy-crop into our normalized
 * ImageCropRect (0–1 values relative to source image dimensions).
 * Also computes the focalPoint as the center of the cropped area.
 */
export function pixelAreaToRect(
  area: Area,
  naturalWidth: number,
  naturalHeight: number,
): { rect: ImageCropRect; focalPoint: ImageFocalPoint } {
  const rect: ImageCropRect = {
    left: area.x / naturalWidth,
    top: area.y / naturalHeight,
    width: area.width / naturalWidth,
    height: area.height / naturalHeight,
  }

  const focalPoint: ImageFocalPoint = {
    x: (area.x + area.width / 2) / naturalWidth,
    y: (area.y + area.height / 2) / naturalHeight,
  }

  return { rect, focalPoint }
}
