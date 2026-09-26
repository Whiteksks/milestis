import { requestAi, type AiRequestOptions } from '../client'
import type { PortfolioHeaderInput, PortfolioHeaderResult, PortfolioHeroInput, PortfolioHeroResult, PortfolioBioInput, PortfolioBioResult, PortfolioContactInput, PortfolioContactResult, PortfolioFooterInput, PortfolioFooterResult, PortfolioFeaturedWorkInput, PortfolioFeaturedWorkResult } from '../server/content/portfolio'
export type { PortfolioSectionKey, PortfolioHeaderInput, PortfolioHeaderResult, PortfolioHeroInput, PortfolioHeroResult, PortfolioBioInput, PortfolioBioResult, PortfolioContactInput, PortfolioContactResult, PortfolioFooterInput, PortfolioFooterResult, PortfolioFeaturedWorkInput, PortfolioFeaturedWorkResult } from '../server/content/portfolio'
export const PORTFOLIO_SECTION_KEYS = ['header', 'hero', 'bio', 'featuredWork', 'contact', 'footer'] as const

export function generatePortfolioHeader(input: PortfolioHeaderInput, options: AiRequestOptions): Promise<PortfolioHeaderResult> {
  return requestAi('generatePortfolioHeader', input, options)
}

export function generatePortfolioHero(input: PortfolioHeroInput, options: AiRequestOptions): Promise<PortfolioHeroResult> {
  return requestAi('generatePortfolioHero', input, options)
}

export function generatePortfolioBio(input: PortfolioBioInput, options: AiRequestOptions): Promise<PortfolioBioResult> {
  return requestAi('generatePortfolioBio', input, options)
}

export function generatePortfolioContact(input: PortfolioContactInput, options: AiRequestOptions): Promise<PortfolioContactResult> {
  return requestAi('generatePortfolioContact', input, options)
}

export function generatePortfolioFooter(input: PortfolioFooterInput, options: AiRequestOptions): Promise<PortfolioFooterResult> {
  return requestAi('generatePortfolioFooter', input, options)
}

export function generatePortfolioFeaturedWork(input: PortfolioFeaturedWorkInput, options: AiRequestOptions): Promise<PortfolioFeaturedWorkResult> {
  return requestAi('generatePortfolioFeaturedWork', input, options)
}
