import { findPortfolioRepeatingImage, type PortfolioImageContent } from '@/editor/modes/portfolio/image/content'
import type { AspectRatio } from '@/editor/lib/types'

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
