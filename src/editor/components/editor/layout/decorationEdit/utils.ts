import type { DeviceView } from '@/editor/lib/types'

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const round2 = (value: number) => Math.round(value * 100) / 100

export const getBaseSizePx = (size: string | undefined): number => {
  switch (size) {
    case "small":
      return 100
    case "medium":
      return 150
    case "large":
      return 200
    case "xlarge":
      return 300
    default:
      return 160
  }
}

export const getResponsiveFactor = (deviceView: DeviceView): number => {
  switch (deviceView) {
    case "mobile":
      return 0.70
    case "tablet":
      return 0.85
    default:
      return 1
  }
}

/** Load image and return its natural aspect ratio */
export const loadImageAspectRatio = (src: string): Promise<number> => {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight
      resolve(Number.isFinite(ratio) ? ratio : 1)
    }
    img.onerror = () => resolve(1)
    img.src = src
  })
}
