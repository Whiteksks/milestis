import type { FrameStyle } from '@/editor/lib/types'
import type { ImageFitMode, ImageRatioValue, ImageUsageMode } from '../data'

export interface ImageOptionPolicy<T> {
  default: T
  forced?: T
  allowed?: readonly T[]
}

export interface ImagePolicy {
  ratio: ImageOptionPolicy<ImageRatioValue>
  frame: ImageOptionPolicy<FrameStyle>
  render: {
    fit: ImageFitMode
    usage: ImageUsageMode
  }
}
