import { requestAi, type AiRequestOptions } from '../client'
import type { PortfolioStyleInput, PortfolioStyleResult } from '../server/style/portfolio'
export type { PortfolioStyleInput, PortfolioStyleResult } from '../server/style/portfolio'

export function decidePortfolioStyle(input: PortfolioStyleInput, options: AiRequestOptions): Promise<PortfolioStyleResult> {
  return requestAi('decidePortfolioStyle', input, options)
}
