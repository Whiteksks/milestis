import { requestProjectFunction } from './request-project-function'
import type { AnalyzeProjectResult } from "./analyze-project-api"

export interface AnalyzeRepublishResult extends AnalyzeProjectResult {
  /** Full new credit cost (before delta reduction). */
  newCreditCost: number
  /** Credit cost paid during the last publish/republish — the delta baseline. */
  previousCreditCost: number
  /** The project's existing published slug. */
  publishedSlug: string
  /** Share token for private published projects. */
  publishedAccessToken?: string
}

export class AnalyzeRepublishError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

export async function analyzeRepublish(projectId: string): Promise<AnalyzeRepublishResult> {
  return requestProjectFunction<AnalyzeRepublishResult>(
    'analyzeRepublish', { projectId },
    { errorClass: AnalyzeRepublishError, fallbackMessage: 'Failed to analyze project for republish' },
  )
}
