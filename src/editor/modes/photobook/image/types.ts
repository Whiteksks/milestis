import type { ImageSlotId } from '@/editor/image/slots'
import type { ImageValue } from '@/editor/image/data'

export type PhotobookSingleImageSectionId = 'cover' | 'introduction' | 'highlight' | 'ending'

export type PhotobookRepeatingImageSectionId = 'story' | 'gallery'

export type PhotobookSectionImageSlotId = Extract<ImageSlotId, `photobook.${string}`>

export interface PhotobookManagedImage {
  id: string
  slotId: PhotobookSectionImageSlotId
  value: ImageValue
}
