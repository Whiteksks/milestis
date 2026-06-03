import { findPortfolioRepeatingImage, type PortfolioImageContent } from './content'
import { resolvePortfolioManagedImage } from './helpers'
import type { PortfolioTemplateId } from '../template-ids'
import type { PortfolioSingleImageSectionId } from './types'

export function selectPortfolioSingleManagedImage(
  content: PortfolioImageContent,
  sectionId: PortfolioSingleImageSectionId,
) {
  return content[sectionId]
}

export function selectPortfolioRepeatingManagedImage(
  content: PortfolioImageContent,
  imageId: string,
) {
  return findPortfolioRepeatingImage(content, imageId)
}

export function selectPortfolioSingleResolvedImage(
  content: PortfolioImageContent,
  sectionId: PortfolioSingleImageSectionId,
  templateId?: PortfolioTemplateId,
) {
  const image = selectPortfolioSingleManagedImage(content, sectionId)
  return image ? resolvePortfolioManagedImage(image, templateId) : undefined
}

export function selectPortfolioRepeatingResolvedImage(
  content: PortfolioImageContent,
  imageId: string,
  templateId?: PortfolioTemplateId,
) {
  const image = selectPortfolioRepeatingManagedImage(content, imageId)
  return image ? resolvePortfolioManagedImage(image, templateId) : undefined
}
