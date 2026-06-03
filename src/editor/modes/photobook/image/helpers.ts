import { resolveImage } from '@/editor/image/resolve'
import type { ResolvedImage } from '@/editor/image/render'
import { createImageValue, replaceImageValueAsset } from '@/editor/image/editor/create-image-value'
import { getPhotobookRepeatingSectionSlot, getPhotobookSingleSectionSlot } from './slots'
import type {
  PhotobookManagedImage,
  PhotobookRepeatingImageSectionId,
  PhotobookSingleImageSectionId,
} from './types'

export function createPhotobookSectionImage(options: {
  id: string
  sectionId: PhotobookSingleImageSectionId
  src: string
  alt?: string
  blurDataUrl?: string
  caption?: string
  description?: string
}): PhotobookManagedImage {
  const slotId = getPhotobookSingleSectionSlot(options.sectionId)

  return {
    id: options.id,
    slotId,
    value: createImageValue({
      slotId,
      src: options.src,
      alt: options.alt,
      blurDataUrl: options.blurDataUrl,
      caption: options.caption,
      description: options.description,
    }),
  }
}

export function createPhotobookRepeatingImage(options: {
  id: string
  sectionId: PhotobookRepeatingImageSectionId
  src: string
  alt?: string
  blurDataUrl?: string
  caption?: string
  description?: string
}): PhotobookManagedImage {
  const slotId = getPhotobookRepeatingSectionSlot(options.sectionId)

  return {
    id: options.id,
    slotId,
    value: createImageValue({
      slotId,
      src: options.src,
      alt: options.alt,
      blurDataUrl: options.blurDataUrl,
      caption: options.caption,
      description: options.description,
    }),
  }
}

export function replacePhotobookManagedImageAsset(
  image: PhotobookManagedImage,
  options: {
    src: string
    alt?: string
    blurDataUrl?: string
  },
): PhotobookManagedImage {
  return {
    ...image,
    value: replaceImageValueAsset(image.value, {
      slotId: image.slotId,
      src: options.src,
      alt: options.alt,
      blurDataUrl: options.blurDataUrl,
    }),
  }
}

export function resolvePhotobookManagedImage(image: PhotobookManagedImage): ResolvedImage {
  return resolveImage(image.value, image.slotId)
}
