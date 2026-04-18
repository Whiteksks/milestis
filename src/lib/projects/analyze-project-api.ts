import { auth } from "../firebase/firebase"

export interface AnalyzeProjectResult {
  ok: true
  quoteId: string
  projectName: string
  /** Full canonical URL the project will be published at. */
  domain: string
  photoCount: number
  creditCost: number
  /** User's current balance at analysis time. */
  userBalance: number
  /** Unix ms — quote is invalid after this time. */
  expiresAt: number
}

export class AnalyzeProjectError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

export async function analyzeProject(
  projectId: string,
  slug: string,
): Promise<AnalyzeProjectResult> {
  const user = auth.currentUser
  if (!user) throw new AnalyzeProjectError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const url = process.env.NEXT_PUBLIC_ANALYZE_PROJECT_URL
  if (!url) throw new AnalyzeProjectError("CONFIG_ERROR", "Analyze URL not configured")

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
    body: JSON.stringify({ projectId, slug }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new AnalyzeProjectError(data.error ?? "UNKNOWN", data.message ?? "Failed to analyze project")
  }

  return data as AnalyzeProjectResult
}
