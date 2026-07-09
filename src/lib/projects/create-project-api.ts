import { auth } from "../firebase/firebase"
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
  const user = auth.currentUser
  if (!user) throw new CreateProjectError("UNAUTHORIZED", "Not authenticated")

  const idToken = await user.getIdToken()
  const url = process.env.NEXT_PUBLIC_CREATE_PROJECT_URL
  if (!url) throw new CreateProjectError("CONFIG_ERROR", "Create project URL not configured")

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`,
    },
    body: JSON.stringify({ name, mode }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new CreateProjectError(data.error ?? "UNKNOWN", data.message ?? "Failed to create project")
  }

  return { projectId: data.projectId as string, shareCode: data.shareCode as string | undefined }
}
