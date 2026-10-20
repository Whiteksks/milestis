/** Promise-based notifications for project and account operations. */

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

  /** Rename project (from inline name input). */
  rename<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Renaming…",
      success: "Project renamed",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to rename project",
    })
  },

  /** Publish project — copies files and creates public snapshot. */
  publish<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Publishing…",
      success: "Project published!",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to publish project",
    })
  },

  /** Unpublish project — removes public snapshot. */
  unpublish<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Unpublishing…",
      success: "Project unpublished",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to unpublish project",
    })
  },

  /** Re-publish a previously hidden project using the saved slug. */
  republish<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Republishing…",
      success: "Project is live again!",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to republish project",
    })
  },


}

// ─── User / Profile ────────────────────────────────────────────────────────

export const toastUser = {
  /** Save public profile fields (bio, location, social links…). */
  saveProfile<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Saving profile…",
      success: "Profile saved",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to save profile",
    })
  },

  /** Update display name. */
  saveName<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Saving…",
      success: "Name updated",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to update name",
    })
  },

  /** Save account settings (notifications, preferences…). */
  saveSettings<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Saving…",
      success: "Settings saved",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to save settings",
    })
  },

  exportData<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Preparing download…",
      success: "Download started",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to export data",
    })
  },

  deleteAccount<T>(promise: Promise<T>) {
    return toast.promise(promise, {
      loading: "Deleting account…",
      success: "Account deleted",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to delete account",
    })
  },
}

// ─── Generic helpers ───────────────────────────────────────────────────────

/** Re-export raw toast so you can still call toast.success() etc. anywhere. */
export { toast }
