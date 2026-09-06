const STORAGE_PREFIX = "milestis:publish-slug:"

/**
 * Best-effort read of the user's last-typed publish slug for this project. Used so the
 * publish form remembers what the user chose instead of always falling back to a name
 * derived from the project title — localStorage can throw in private-browsing/disabled
 * contexts, never let that break the publish flow.
 */
export function getStoredPublishSlug(projectId: string): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(`${STORAGE_PREFIX}${projectId}`) || null
  } catch {
    return null
  }
}

export function setStoredPublishSlug(projectId: string, slug: string): void {
  if (typeof window === "undefined") return
  try {
    if (slug) window.localStorage.setItem(`${STORAGE_PREFIX}${projectId}`, slug)
  } catch {
    // Ignore — non-critical persistence.
  }
}
