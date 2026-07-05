import { auth } from "../firebase/firebase"

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
  const user = auth.currentUser
  if (!user) throw new RepublishProjectError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const url = process.env.NEXT_PUBLIC_REPUBLISH_PROJECT_URL
  if (!url) throw new RepublishProjectError("CONFIG_ERROR", "Republish URL not configured")

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
    body: JSON.stringify({ projectId, quoteId }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new RepublishProjectError(data.error ?? "UNKNOWN", data.message ?? "Failed to republish project")
  }

  return data as RepublishProjectResult
}

