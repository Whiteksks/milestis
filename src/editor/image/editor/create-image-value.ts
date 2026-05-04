import { getImagePolicy } from '../policy/registry'
import type { ImageSlotId } from '../slots'
import type { ImageAsset, ImageFocalPoint, ImageValue } from '../data'

export interface CreateImageValueInput {
  slotId: ImageSlotId
  src: string
  alt?: string
  blurDataUrl?: string
  caption?: string
  description?: string
  focalPoint?: ImageFocalPoint
}

export function createImageAssetFromSource(input: {
  src: string
  alt?: string
  blurDataUrl?: string
}): ImageAsset {
  return {
    src: input.src,
    // Dimensions are not loaded upfront.
    width: 0,
    height: 0,
    alt: input.alt,
    blurDataUrl: input.blurDataUrl,
  }
}

export function createImageValue(input: CreateImageValueInput): ImageValue {
  const asset = createImageAssetFromSource(input)
  const policy = getImagePolicy(input.slotId)

  return {
    asset,
    crop: undefined,
    focalPoint: input.focalPoint,
    presentation: {
      ratio: policy.ratio.default,
      frameStyle: policy.frame.default,
      fit: policy.render.fit,
    },
    caption: input.caption,
    description: input.description,
  }
}

export function replaceImageValueAsset(
  current: ImageValue,
  input: Omit<CreateImageValueInput, 'slotId' | 'caption' | 'description' | 'focalPoint'> & {
    slotId: ImageSlotId
    focalPoint?: ImageFocalPoint
  },
): ImageValue {
  const nextAsset = createImageAssetFromSource(input)

  return {
    ...current,
    asset: nextAsset,
    // focalPoint is specific to the image content — don't inherit from the old asset.
    focalPoint: input.focalPoint,
    // Clear stale crop — was computed for a different asset.
    crop: undefined,
    // presentation (ratio, frameStyle, fit) preserved via ...current spread.
  }
}
