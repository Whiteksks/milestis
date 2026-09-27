import { FieldValue } from "firebase-admin/firestore";
import type { MenuBilling } from "./menu/billing/model";

export type ProjectMode = "portfolio" | "photobook" | "event" | "menu";
export type ProjectStatus = "active" | "archived" | "deleted";
export type EventPhotoStatus = "pending" | "approved" | "rejected";

/**
 * Configuration stored inside `projects/{projectId}` when mode === "event".
 * Written at creation time by createProject; mutated by uploadEventPhoto and the SafeSearch batch.
 */
export interface EventConfig {
  /** Maximum total approved photos allowed for this event. */
  maxPhotos: number;
  /** Maximum photos per anonymous guest. */
  maxPhotosPerGuest: number;
  /** Count of approved photos. Incremented by the SafeSearch batch trigger. */
  approvedCount: number;
  /** Count of photos awaiting SafeSearch review. */
  pendingCount: number;
}

/**
 * Shape of a document in the `projects/{projectId}/eventPhotos/{photoId}` subcollection.
 */
export interface EventPhotoRecord {
  /** Firebase anonymous UID of the uploader. */
  anonymousUid: string;
  /** Full Storage path (bucket-relative) to the uploaded file. */
  storageRef: string;
  /** Original filename from the client upload. */
  originalFileName: string;
  status: EventPhotoStatus;
  uploadedAt: FieldValue;
  /** Set when SafeSearch batch completes review. */
  reviewedAt?: FieldValue;
  /** SafeSearch categories that triggered rejection. */
  violations?: string[];
}

/** Shape written to `published_projects/{projectId}` */
export interface PublishedProjectData {
  ownerId: string;
  slug: string;
  name: string;
  mode: ProjectMode;
  /** SHA-256 hex of the plain-text token. Portfolio projects do not have one. */
  accessToken?: string;
  theme: Record<string, unknown> | null;
  content: Record<string, unknown> | null;
  publishedAt: FieldValue;
}

/**
 * Shape of the Firestore document written at creation time.
 * theme and content are absent — the editor writes them on first save.
 *
 * Firestore path: projects/{projectId}
 */
export interface ProjectMetadata {
  menuBilling?: MenuBilling;
  id: string;
  ownerId: string;
  name: string;
  mode: ProjectMode;
  status: ProjectStatus;
  createdAt: FieldValue;
  updatedAt: FieldValue;
  schemaVersion: number;
  isPublished?: boolean;  // Set by the publish function; absent until first publish action
  /** Unique attempt id for the current publish lock owner. */
  publishLockId?: string;
  /** Soft lease for the current publish attempt to avoid concurrent publishes. */
  publishLockExpiresAtMillis?: number;
  /** Last successful debit transaction id for the publish flow. */
  publishTransactionId?: string;
  /** Incremented on every publish/republish — used as idempotency key suffix. */
  publishVersion?: number;
  /** The slug used when the project was last published. Preserved on unpublish for safe republish. */
  publishedSlug?: string;
  /** Plaintext access token for the owner's share link. Preserved on unpublish. Photobooks only. */
  publishedAccessToken?: string;
  template?: {
    id: string;
  };  // Optional template reference for future use
  /** Set when the user moves a project to the trash. */
  deletedAt?: FieldValue;
  /**
   * Precomputed date when the project will be permanently purged.
   * Rule: if deletedAt.day < 10  → purgeAt = 1st of next month
   *       if deletedAt.day >= 10 → purgeAt = 1st of month after next
   * Example: deleted Jan 5  → purge Feb 1
   *          deleted Jan 20 → purge Mar 1
   */
  purgeAt?: FieldValue;
  /** Present only when mode === "event". */
  eventConfig?: EventConfig;
}

/** Payload the client sends to the createProject Cloud Function. */
export type CreateProjectPayload =
  | { mode: "menu"; name: string; template?: { id: string } }
  | { mode: "portfolio"; name: string; template?: { id: string } }
  | { mode: "photobook"; name: string; template?: { id: string } }
  | { mode: "event"; name: string; template?: { id: string } };


export const PROJECT_NAME_MIN_LENGTH = 1;
export const PROJECT_NAME_MAX_LENGTH = 100;
export const VALID_MODES: ProjectMode[] = ["portfolio", "photobook", "event", "menu"];

/** Default limits applied when creating an event project. */
export const EVENT_DEFAULTS = {
  maxPhotos: 100,
  maxPhotosPerGuest: 2,
} as const;
