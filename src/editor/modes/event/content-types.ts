/** Event-mode-specific content and visibility types.
 *  Kept here so the mode is fully self-contained. */

// ─── Guest photo (loaded from Firestore, never persisted in editor content) ──

export interface EventGuestPhoto {
  /** eventPhotos document ID */
  id: string
  /** Storage path, e.g. events/{projectId}/{photoId}.jpg */
  storageRef: string
  /** Upload timestamp in millis — null if serverTimestamp hasn't resolved yet */
  uploadedAt: number | null
  /** WebP thumbnail URL (800px wide) — available after SafeSearch approval */
  thumbUrl?: string
  /** WebP full-resolution URL (1600px wide) — available after SafeSearch approval */
  fullUrl?: string
}

// ─── Editor content ─────────────────────────────────────────────────────────
// Event mode is visual-only — no text fields in the editor canvas.

export interface EventSectionContent {
  // intentionally empty — visual-only mode
}

// ─── Visibility ───────────────────────────────────────────────────────────────
// Event mode has a single section so visibility is trivial,
// but it must satisfy the ModeRegistryEntry<TVisibilityKey> constraint.

export interface EventSectionVisibility {
  showGallery: boolean
}
