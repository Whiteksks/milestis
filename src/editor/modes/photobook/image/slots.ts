import type {
  PhotobookRepeatingImageSectionId,
  PhotobookSectionImageSlotId,
  PhotobookSingleImageSectionId,
} from './types'

const PHOTOBOOK_SINGLE_SECTION_SLOT_MAP: Record<PhotobookSingleImageSectionId, PhotobookSectionImageSlotId> = {
  cover: 'photobook.cover.primary',
  introduction: 'photobook.introduction.primary',
  highlight: 'photobook.highlight.primary',
  ending: 'photobook.ending.primary',
}

const PHOTOBOOK_REPEATING_SECTION_SLOT_MAP: Record<PhotobookRepeatingImageSectionId, PhotobookSectionImageSlotId> = {
  story: 'photobook.story.block',
  gallery: 'photobook.gallery.item',
}

export function getPhotobookSingleSectionSlot(sectionId: PhotobookSingleImageSectionId): PhotobookSectionImageSlotId {
  return PHOTOBOOK_SINGLE_SECTION_SLOT_MAP[sectionId]
}

export function getPhotobookRepeatingSectionSlot(sectionId: PhotobookRepeatingImageSectionId): PhotobookSectionImageSlotId {
  return PHOTOBOOK_REPEATING_SECTION_SLOT_MAP[sectionId]
}
