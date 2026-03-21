import { auth } from "../firebase/firebase"

export class UnpublishProjectError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

export async function unpublishProject(projectId: string): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new UnpublishProjectError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const url = process.env.NEXT_PUBLIC_UNPUBLISH_PROJECT_URL
  if (!url) throw new UnpublishProjectError("CONFIG_ERROR", "Unpublish URL not configured")

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
    body: JSON.stringify({ projectId }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new UnpublishProjectError(data.error ?? "UNKNOWN", data.message ?? "Failed to unpublish project")
  }
}
