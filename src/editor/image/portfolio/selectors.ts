import { findPortfolioRepeatingImage, type PortfolioImageContent } from './content'
import { resolvePortfolioManagedImage } from './helpers'
import type { TemplateId } from '@/editor/lib/types'
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
  templateId?: TemplateId,
) {
  const image = selectPortfolioSingleManagedImage(content, sectionId)
  return image ? resolvePortfolioManagedImage(image, templateId) : undefined
}

export function selectPortfolioRepeatingResolvedImage(
  content: PortfolioImageContent,
  imageId: string,
  templateId?: TemplateId,
) {
  const image = selectPortfolioRepeatingManagedImage(content, imageId)
  return image ? resolvePortfolioManagedImage(image, templateId) : undefined
}
