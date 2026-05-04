import { resolveImage } from '../resolve'
import type { ResolvedImage } from '../render'
import { createImageValue, replaceImageValueAsset } from '../editor/create-image-value'
import { getPortfolioSingleSectionSlot, getPortfolioRepeatingSectionSlot } from './slots'
import type { TemplateId } from '@/editor/lib/types'
import type {
  PortfolioManagedImage,
  PortfolioRepeatingImageSectionId,
  PortfolioSingleImageSectionId,
} from './types'

export function createPortfolioSectionImage(options: {
  id: string
  sectionId: PortfolioSingleImageSectionId
  src: string
  alt?: string
  blurDataUrl?: string
  caption?: string
  description?: string
}): PortfolioManagedImage {
  const slotId = getPortfolioSingleSectionSlot(options.sectionId)

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

export function createPortfolioRepeatingImage(options: {
  id: string
  sectionId: PortfolioRepeatingImageSectionId
  src: string
  alt?: string
  blurDataUrl?: string
  caption?: string
  description?: string
}): PortfolioManagedImage {
  const slotId = getPortfolioRepeatingSectionSlot(options.sectionId)

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

export function replacePortfolioManagedImageAsset(
  image: PortfolioManagedImage,
  options: {
    src: string
    alt?: string
    blurDataUrl?: string
  },
): PortfolioManagedImage {
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

export function resolvePortfolioManagedImage(
  image: PortfolioManagedImage,
  templateId?: TemplateId,
): ResolvedImage {
  return resolveImage(image.value, image.slotId, templateId)
}
