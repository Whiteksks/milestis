import type { ImageSlotId } from '@/editor/image/slots'
import type { ImageValue } from '@/editor/image/data'

/** Sections that hold a single managed image in portfolio. */
export type PortfolioSingleImageSectionId = 'hero' | 'bio'

/** Sections that hold repeating managed images in portfolio. */
export type PortfolioRepeatingImageSectionId = 'featured-work'

/** Narrowed union of portfolio-specific slot IDs. */
export type PortfolioSectionImageSlotId = Extract<ImageSlotId, `portfolio.${string}`>

export interface PortfolioManagedImage {
  id: string
  slotId: PortfolioSectionImageSlotId
  value: ImageValue
}
