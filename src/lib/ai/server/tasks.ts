import 'server-only'
import { generatePhotobookCover, generatePhotobookIntroduction, generatePhotobookGallery, generatePhotobookHighlight, generatePhotobookEnding, generatePhotobookStory } from './content/photobook'
import { generatePortfolioHeader, generatePortfolioHero, generatePortfolioBio, generatePortfolioContact, generatePortfolioFooter, generatePortfolioFeaturedWork } from './content/portfolio'
import { decidePhotobookStyle } from './style/photobook'
import { decidePortfolioStyle } from './style/portfolio'
import { classifyIntent } from './intent/classify'
import { generateChatReply } from './chat/respond'
import { generateMenu } from './menu'

export const aiTasks = {
  generatePhotobookCover,
  generatePhotobookIntroduction,
  generatePhotobookGallery,
  generatePhotobookHighlight,
  generatePhotobookEnding,
  generatePhotobookStory,
  generatePortfolioHeader,
  generatePortfolioHero,
  generatePortfolioBio,
  generatePortfolioContact,
  generatePortfolioFooter,
  generatePortfolioFeaturedWork,
  decidePhotobookStyle,
  decidePortfolioStyle,
  classifyIntent,
  generateChatReply,
  generateMenu,
}
export type AiTasks = typeof aiTasks
