/**
 * Universal toast service built on top of Sonner.
 *
 * Every helper uses toast.promise() so we track the REAL async operation —
 * no fake timers, no simulations. Sonner shows:
 *   ⏳ loading  →  ✅ success  (or ❌ error)
 * automatically when the promise settles.
 *
 * Usage:
 *   import { toastProject } from "@/lib/toast"
 *   toastProject.create(createProject(name, mode))
 */

import { toast } from "sonner"

// ─── Project ───────────────────────────────────────────────────────────────

export const toastProject = {
  /** Pass the createProject() promise — Sonner tracks it end-to-end. */
  create<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Creating project…",
      success: "Project created!",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to create project",
    })
  },

  /** Soft-delete (move to trash). */
  delete<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Moving to trash…",
      success: "Project moved to trash",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to delete project",
    })
  },

  /** Permanent / force-delete. */
  forceDelete<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Deleting permanently…",
      success: "Project permanently deleted",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to delete project",
    })
  },

  /** Restore from trash. */
  restore<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Restoring project…",
      success: "Project restored",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to restore project",
    })
  },

  /** Save project in editor. */
  save<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Saving…",
      success: "Saved",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to save project",
    })
  },

  /** Rename project (from inline name input). */
  rename<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Renaming…",
      success: "Project renamed",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to rename project",
    })
  },
}

// ─── Storage / Upload ──────────────────────────────────────────────────────

export const toastStorage = {
  /**
   * Photo or file upload.
   * Pass the upload promise — Sonner shows real progress states.
   */
  upload<T>(promise: Promise<T>, fileName?: string) {
    const label = fileName ? `"${fileName}"` : "File"
    return toast.promise(promise, {
      loading: `Uploading ${label}…`,
      success: `${label} uploaded`,
      error: (err) =>
        err instanceof Error ? err.message : `Failed to upload ${label}`,
    })
  },

  /** Generic delete from storage. */
  remove<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Removing file…",
      success: "File removed",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to remove file",
    })
  },
}

// ─── Generic helpers ───────────────────────────────────────────────────────

/** Re-export raw toast so you can still call toast.success() etc. anywhere. */
export { toast }
