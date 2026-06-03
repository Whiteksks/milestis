import type {
  PhotobookManagedImage,
  PhotobookRepeatingImageSectionId,
  PhotobookSingleImageSectionId,
} from './types'

export interface PhotobookImageContent {
  cover?: PhotobookManagedImage
  introduction?: PhotobookManagedImage
  story: PhotobookManagedImage[]
  gallery: PhotobookManagedImage[]
  highlight?: PhotobookManagedImage
  ending?: PhotobookManagedImage
}

export function createEmptyPhotobookImageContent(): PhotobookImageContent {
  return {
    story: [],
    gallery: [],
  }
}

export function setPhotobookSingleImage(
  content: PhotobookImageContent,
  sectionId: PhotobookSingleImageSectionId,
  image?: PhotobookManagedImage,
): PhotobookImageContent {
  return {
    ...content,
    [sectionId]: image,
  }
}

export function appendPhotobookRepeatingImage(
  content: PhotobookImageContent,
  sectionId: PhotobookRepeatingImageSectionId,
  image: PhotobookManagedImage,
): PhotobookImageContent {
  return {
    ...content,
    [sectionId]: [...content[sectionId], image],
  }
}

export function replacePhotobookRepeatingImage(
  content: PhotobookImageContent,
  sectionId: PhotobookRepeatingImageSectionId,
  imageId: string,
  image: PhotobookManagedImage,
): PhotobookImageContent {
  return {
    ...content,
    [sectionId]: content[sectionId].map((entry) => (entry.id === imageId ? image : entry)),
  }
}

export function removePhotobookRepeatingImage(
  content: PhotobookImageContent,
  sectionId: PhotobookRepeatingImageSectionId,
  imageId: string,
): PhotobookImageContent {
  return {
    ...content,
    [sectionId]: content[sectionId].filter((entry) => entry.id !== imageId),
  }
}

export function findPhotobookRepeatingImage(
  content: PhotobookImageContent,
  sectionId: PhotobookRepeatingImageSectionId,
  imageId: string,
): PhotobookManagedImage | undefined {
  return content[sectionId].find((entry) => entry.id === imageId)
}
