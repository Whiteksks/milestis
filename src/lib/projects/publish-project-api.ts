import { auth } from "../firebase/firebase"

export class PublishProjectError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

export async function publishProject(projectId: string): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new PublishProjectError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const url = process.env.NEXT_PUBLIC_PUBLISH_PROJECT_URL
  if (!url) throw new PublishProjectError("CONFIG_ERROR", "Publish URL not configured")

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
    body: JSON.stringify({ projectId }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new PublishProjectError(data.error ?? "UNKNOWN", data.message ?? "Failed to publish project")
  }
}
