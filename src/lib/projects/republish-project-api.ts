import { auth } from "../firebase/firebase"

export class RepublishProjectError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

/**
 * Re-publishes a previously unpublished (hidden) project using the same slug and token.
 * Free if the slug is still available; throws SLUG_TAKEN if someone else claimed it.
 */
export async function republishProject(projectId: string): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new RepublishProjectError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const url = process.env.NEXT_PUBLIC_REPUBLISH_PROJECT_URL
  if (!url) throw new RepublishProjectError("CONFIG_ERROR", "Republish URL not configured")

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
    body: JSON.stringify({ projectId }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new RepublishProjectError(data.error ?? "UNKNOWN", data.message ?? "Failed to republish project")
  }
}
