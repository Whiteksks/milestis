import { functionUrl } from '@/config/firebase'
import { auth } from "../firebase/firebase"

export class UserAccountError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }
}

function parseFilename(contentDisposition: string | null, fallback: string): string {
  if (!contentDisposition) return fallback

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1])

  const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i)
  return plainMatch?.[1] ?? fallback
}

async function postWithAuth(url: string): Promise<Response> {
  const user = auth.currentUser
  if (!user) throw new UserAccountError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  return fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${idToken}`,
    },
  })
}

async function triggerDownloadFromResponse(res: Response, fallbackFilename: string): Promise<void> {
  const blob = await res.blob()
  const downloadUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = downloadUrl
  anchor.download = parseFilename(res.headers.get("content-disposition"), fallbackFilename)
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(downloadUrl)
}

async function handleErrorResponse(res: Response, fallbackMessage: string): Promise<never> {
  let data: { error?: string; message?: string } | null = null

  try {
    data = await res.json() as { error?: string; message?: string }
  } catch {
    data = null
  }

  throw new UserAccountError(data?.error ?? "UNKNOWN", data?.message ?? fallbackMessage)
}

export async function downloadAccountData(): Promise<void> {
  const url = functionUrl('exportUserData')
  const res = await postWithAuth(url)

  if (!res.ok) {
    await handleErrorResponse(res, "Failed to export account data")
  }

  await triggerDownloadFromResponse(res, "milestis-user-data.json")
}

export async function downloadProjectContent(projectId: string): Promise<void> {
  const url = functionUrl('exportProjectContent')
  const user = auth.currentUser
  if (!user) throw new UserAccountError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId }),
  })

  if (!res.ok) {
    await handleErrorResponse(res, "Failed to export project content")
  }

  await triggerDownloadFromResponse(res, `milestis-project-${projectId}.json`)
}

export async function deleteAccount(): Promise<void> {
  const url = functionUrl('deleteUserAccount')
  const res = await postWithAuth(url)

  if (!res.ok) {
    await handleErrorResponse(res, "Failed to delete account")
  }
}
