/** Single source of truth for portfolio template IDs.
 *  To add a new portfolio template — add its id here. That's all. */
export const PORTFOLIO_TEMPLATE_IDS = [
  'editorial',
  'minimal',
  'elegant',
  'grid',
  'bento',
  'showcase',
  'liquid-glass',
] as const

export type PortfolioTemplateId = (typeof PORTFOLIO_TEMPLATE_IDS)[number]
