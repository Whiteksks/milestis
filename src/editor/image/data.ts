import type { AspectRatio, FrameStyle } from '@/editor/lib/types'

export type ImageRatioValue = AspectRatio | `${number}/${number}`

export type ImageCropOrigin = 'auto' | 'user'

export type ImageFitMode = 'cover' | 'contain'

export type ImageUsageMode = 'inline' | 'background' | 'fill'

export interface ImageFocalPoint {
  x: number
  y: number
}

export interface ImageCropRect {
  left: number
  top: number
  width: number
  height: number
}

export interface ImageCropValue {
  origin: ImageCropOrigin
  ratio: ImageRatioValue
  rect: ImageCropRect
  algorithm: 'manual' | 'centered-v1'
  /** Source image URL — used to detect stale crops after asset replacement. */
  assetSrc?: string
}

export interface ImageAsset {
  src: string
  width: number
  height: number
  alt?: string
  blurDataUrl?: string
}

export interface ImagePresentation {
  ratio?: ImageRatioValue
  frameStyle?: FrameStyle
  fit?: ImageFitMode
}

/** Raw image data — stored in DB and passed from templates. */
export interface ImageValue {
  asset: ImageAsset
  crop?: ImageCropValue
  focalPoint?: ImageFocalPoint
  presentation?: ImagePresentation
  caption?: string
  description?: string
}
