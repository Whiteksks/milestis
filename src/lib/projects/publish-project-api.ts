import { requestProjectFunction } from './request-project-function'

export interface PublishProjectResult {
  ok: true
  publishedSlug: string
  balance: {
    total: number
    purchased: number
    subscription: number
    bonus: number
  }
}

export class PublishProjectError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

export async function publishProject(
  projectId: string,
  slug: string,
  quoteId: string,
  accessToken?: string,
): Promise<PublishProjectResult> {
  return requestProjectFunction<PublishProjectResult>(
    'publishProject',
    { projectId, slug, quoteId, ...(accessToken ? { accessToken } : {}) },
    { errorClass: PublishProjectError, fallbackMessage: 'Failed to publish project' },
  )
}
