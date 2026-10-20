import { requestProjectFunction } from './request-project-function'

export class DeleteProjectError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

/**
 * Permanently deletes a single trashed project immediately.
 * The project must have status == 'deleted' before calling this.
 */
export async function forceDeleteProject(projectId: string): Promise<void> {
  await requestProjectFunction(
    'forceDeleteProject', { projectId },
    { errorClass: DeleteProjectError, fallbackMessage: 'Failed to delete project' },
  )
}
