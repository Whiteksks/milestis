import type { FrameStyle } from '@/editor/lib/types'
import type { ImageCropValue, ImageFitMode, ImageRatioValue, ImageUsageMode, ImageAsset } from './data'

/** Runtime-only resolved image — never stored, only used for rendering. */
export interface ResolvedImage {
  slotId: string
  asset: ImageAsset
  /** Optional explicit crop, usually user-defined and applied at render time. */
  crop?: ImageCropValue
  /** CSS object-position value. Used when crop is absent. Derived from focalPoint. */
  objectPosition?: string
  ratio: ImageRatioValue
  frameStyle: FrameStyle
  fit: ImageFitMode
  usage: ImageUsageMode
  caption?: string
  description?: string
}
