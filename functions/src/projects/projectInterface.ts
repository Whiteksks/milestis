import { FieldValue } from "firebase-admin/firestore";

export type ProjectMode = "portfolio" | "photobook";
export type ProjectStatus = "active" | "archived" | "deleted";

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
}

/** Payload the client sends to the createProject Cloud Function. */
export type CreateProjectPayload =
  | { mode: "portfolio"; name: string; template?: { id: string } }
  | { mode: "photobook"; name: string; template?: { id: string } };


export const PROJECT_NAME_MIN_LENGTH = 1;
export const PROJECT_NAME_MAX_LENGTH = 100;
export const VALID_MODES: ProjectMode[] = ["portfolio", "photobook"];
