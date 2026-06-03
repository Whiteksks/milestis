import type { PortfolioSectionImageSlotId, PortfolioSingleImageSectionId, PortfolioRepeatingImageSectionId } from './types'

const PORTFOLIO_SINGLE_SECTION_SLOT_MAP: Record<PortfolioSingleImageSectionId, PortfolioSectionImageSlotId> = {
  hero: 'portfolio.hero.primary',
  bio:  'portfolio.bio.primary',
}

const PORTFOLIO_REPEATING_SECTION_SLOT_MAP: Record<PortfolioRepeatingImageSectionId, PortfolioSectionImageSlotId> = {
  'featured-work': 'portfolio.featured-work.item',
}

export function getPortfolioSingleSectionSlot(sectionId: PortfolioSingleImageSectionId): PortfolioSectionImageSlotId {
  return PORTFOLIO_SINGLE_SECTION_SLOT_MAP[sectionId]
}

export function getPortfolioRepeatingSectionSlot(sectionId: PortfolioRepeatingImageSectionId): PortfolioSectionImageSlotId {
  return PORTFOLIO_REPEATING_SECTION_SLOT_MAP[sectionId]
}
