import { auth } from "../firebase/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export class ExportProjectError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message)
  }
}

export interface ExportProjectInput {
  projectId: string
  publish?: {
    slug: string
    /** Plaintext token (photobook only). */
    accessToken?: string
  }
}

export interface PortfolioRenderData {
  templateId: string
  themeId: string
  sectionContent: Record<string, unknown>
  sectionVisibility: Record<string, boolean>
  projectName: string
}

export interface ExportProjectResult {
  exportId: string
  versionNumber: number
  /** PDF download URL — photobook only. Undefined for portfolio. */
  fileDownloadUrl?: string
  /** Present only when the request included a publish payload. */
  publishedSlug?: string
  /** Portfolio only — passed to the client-side ZIP renderer. */
  portfolioRenderData?: PortfolioRenderData
  balance: {
    total: number
    purchased: number
    subscription: number
    bonus: number
  }
}

// ─── API call ─────────────────────────────────────────────────────────────────

export async function exportProject(
  input: ExportProjectInput,
): Promise<ExportProjectResult> {
  const user = auth.currentUser
  if (!user) throw new ExportProjectError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const url = process.env.NEXT_PUBLIC_EXPORT_PROJECT_URL
  if (!url) throw new ExportProjectError("CONFIG_ERROR", "Export URL not configured")

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(input),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new ExportProjectError(data.error ?? "UNKNOWN", data.message ?? "Export failed")
  }

  return data as ExportProjectResult
}

// ─── Publish exported project ─────────────────────────────────────────────────

export interface PublishExportedProjectInput {
  projectId: string
  slug: string
  /** Plaintext token (photobook only). */
  accessToken?: string
}

export interface PublishExportedProjectResult {
  publishedSlug: string
}

export async function publishExportedProject(
  input: PublishExportedProjectInput,
): Promise<PublishExportedProjectResult> {
  const user = auth.currentUser
  if (!user) throw new ExportProjectError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const url = process.env.NEXT_PUBLIC_PUBLISH_EXPORTED_PROJECT_URL
  if (!url) throw new ExportProjectError("CONFIG_ERROR", "Publish URL not configured")

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(input),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new ExportProjectError(data.error ?? "UNKNOWN", data.message ?? "Publish failed")
  }

  return data as PublishExportedProjectResult
}
