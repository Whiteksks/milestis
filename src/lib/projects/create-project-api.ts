import { requestProjectFunction } from './request-project-function'
import type { ProjectMode } from "./project-type-config"

export class CreateProjectError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

export async function createProject(
  name: string,
  mode: ProjectMode
): Promise<{ projectId: string; shareCode?: string }> {
  const data = await requestProjectFunction<{ projectId: string; shareCode?: string }>(
    'createProject', { name, mode },
    { errorClass: CreateProjectError, fallbackMessage: 'Failed to create project' },
  )
  return { projectId: data.projectId, shareCode: data.shareCode }
}
