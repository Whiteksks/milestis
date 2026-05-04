import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { findPortfolioRepeatingImage, type PortfolioImageContent } from '@/editor/image/portfolio/content'
import type { AspectRatio } from '@/editor/lib/types'

export type PortfolioImageSectionProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'>

export function getPortfolioFeaturedWorkImage(
  imageContent: PortfolioImageContent | undefined,
  imageId: string,
) {
  return imageContent ? findPortfolioRepeatingImage(imageContent, imageId) : undefined
}

export function toCanonicalAspectRatio(
  ratio: string | undefined,
  fallback: AspectRatio,
): AspectRatio {
  switch (ratio) {
    case 'square':
    case 'portrait':
    case 'poster':
    case 'wide':
    case 'cinematic':
      return ratio
    default:
      return fallback
  }
}
