import type {
  PortfolioManagedImage,
  PortfolioSingleImageSectionId,
} from './types'

/** All managed images for a portfolio project. */
export interface PortfolioImageContent {
  hero?: PortfolioManagedImage
  bio?: PortfolioManagedImage
  /** featured-work images — ordered list. */
  featuredWork: PortfolioManagedImage[]
}

export function createEmptyPortfolioImageContent(): PortfolioImageContent {
  return {
    featuredWork: [],
  }
}

export function setPortfolioSingleImage(
  content: PortfolioImageContent,
  sectionId: PortfolioSingleImageSectionId,
  image?: PortfolioManagedImage,
): PortfolioImageContent {
  return {
    ...content,
    [sectionId]: image,
  }
}

export function appendPortfolioRepeatingImage(
  content: PortfolioImageContent,
  image: PortfolioManagedImage,
): PortfolioImageContent {
  return {
    ...content,
    featuredWork: [...content.featuredWork, image],
  }
}

export function replacePortfolioRepeatingImage(
  content: PortfolioImageContent,
  imageId: string,
  image: PortfolioManagedImage,
): PortfolioImageContent {
  return {
    ...content,
    featuredWork: content.featuredWork.map((entry) => (entry.id === imageId ? image : entry)),
  }
}

export function removePortfolioRepeatingImage(
  content: PortfolioImageContent,
  imageId: string,
): PortfolioImageContent {
  return {
    ...content,
    featuredWork: content.featuredWork.filter((entry) => entry.id !== imageId),
  }
}

export function findPortfolioRepeatingImage(
  content: PortfolioImageContent,
  imageId: string,
): PortfolioManagedImage | undefined {
  return content.featuredWork.find((entry) => entry.id === imageId)
}
