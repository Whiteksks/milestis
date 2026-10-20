import { requestProjectFunction } from './request-project-function'

export class UnpublishProjectError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

export async function unpublishProject(projectId: string): Promise<void> {
  await requestProjectFunction(
    'unpublishProject', { projectId },
    { errorClass: UnpublishProjectError, fallbackMessage: 'Failed to unpublish project' },
  )
}
