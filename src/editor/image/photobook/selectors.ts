import type { ContentStore } from '@/editor/lib/store-content'
import { findPhotobookRepeatingImage, type PhotobookImageContent } from './content'
import { resolvePhotobookManagedImage } from './helpers'
import type {
  PhotobookRepeatingImageSectionId,
  PhotobookSingleImageSectionId,
} from './types'

export function selectPhotobookSingleManagedImage(
  content: PhotobookImageContent,
  sectionId: PhotobookSingleImageSectionId,
) {
  return content[sectionId]
}

export function selectPhotobookRepeatingManagedImage(
  content: PhotobookImageContent,
  sectionId: PhotobookRepeatingImageSectionId,
  imageId: string,
) {
  return findPhotobookRepeatingImage(content, sectionId, imageId)
}

export function selectPhotobookSingleResolvedImage(
  content: PhotobookImageContent,
  sectionId: PhotobookSingleImageSectionId,
) {
  const image = selectPhotobookSingleManagedImage(content, sectionId)
  return image ? resolvePhotobookManagedImage(image) : undefined
}

export function selectPhotobookRepeatingResolvedImage(
  content: PhotobookImageContent,
  sectionId: PhotobookRepeatingImageSectionId,
  imageId: string,
) {
  const image = selectPhotobookRepeatingManagedImage(content, sectionId, imageId)
  return image ? resolvePhotobookManagedImage(image) : undefined
}

export function selectPhotobookImageContent(state: ContentStore) {
  return state.photobookImageContent
}
