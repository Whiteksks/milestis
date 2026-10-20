import { requestProjectFunction } from './request-project-function'

export interface RepublishProjectResult {
  ok: true
  publishedSlug: string
  publishedAccessToken?: string
  balance: {
    total: number
    purchased: number
    subscription: number
    bonus: number
  }
}

export class RepublishProjectError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

export async function republishProject(projectId: string, quoteId: string): Promise<RepublishProjectResult> {
  return requestProjectFunction<RepublishProjectResult>(
    'republishProject', { projectId, quoteId },
    { errorClass: RepublishProjectError, fallbackMessage: 'Failed to republish project' },
  )
}

