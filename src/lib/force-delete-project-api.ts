import { auth } from "./firebase"

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
  const user = auth.currentUser
  if (!user) throw new DeleteProjectError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const url = process.env.NEXT_PUBLIC_FORCE_DELETE_PROJECT_URL
  if (!url) throw new DeleteProjectError("CONFIG_ERROR", "Force delete URL not configured")

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`,
    },
    body: JSON.stringify({ projectId }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new DeleteProjectError(data.error ?? "UNKNOWN", data.message ?? "Failed to delete project")
  }
}
