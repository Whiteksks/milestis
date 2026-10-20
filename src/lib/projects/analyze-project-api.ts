import { requestProjectFunction } from './request-project-function'

export interface AnalyzeProjectResult {
  ok: true
  quoteId: string
  projectName: string
  /** Full canonical URL the project will be published at. */
  domain: string
  photoCount: number
  creditCost: number
  /** User's current balance at analysis time. */
  userBalance: number
  /** Unix ms — quote is invalid after this time. */
  expiresAt: number
}

export class AnalyzeProjectError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

export async function analyzeProject(
  projectId: string,
  slug: string,
): Promise<AnalyzeProjectResult> {
  return requestProjectFunction<AnalyzeProjectResult>(
    'analyzeProject', { projectId, slug },
    { errorClass: AnalyzeProjectError, fallbackMessage: 'Failed to analyze project' },
  )
}
