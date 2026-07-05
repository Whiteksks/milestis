import { auth } from "../firebase/firebase"
import type { AnalyzeProjectResult } from "./analyze-project-api"

export interface AnalyzeRepublishResult extends AnalyzeProjectResult {
  /** Full new credit cost (before delta reduction). */
  newCreditCost: number
  /** Credit cost paid during the last publish/republish — the delta baseline. */
  previousCreditCost: number
  /** The project's existing published slug. */
  publishedSlug: string
  /** Plaintext access token — only for photobook mode. */
  publishedAccessToken?: string
}

export class AnalyzeRepublishError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

export async function analyzeRepublish(projectId: string): Promise<AnalyzeRepublishResult> {
  const user = auth.currentUser
  if (!user) throw new AnalyzeRepublishError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const url = process.env.NEXT_PUBLIC_ANALYZE_REPUBLISH_URL
  if (!url) throw new AnalyzeRepublishError("CONFIG_ERROR", "Analyze republish URL not configured")

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
    body: JSON.stringify({ projectId }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new AnalyzeRepublishError(data.error ?? "UNKNOWN", data.message ?? "Failed to analyze project for republish")
  }

  return data as AnalyzeRepublishResult
}
