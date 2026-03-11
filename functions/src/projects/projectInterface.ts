import { FieldValue } from "firebase-admin/firestore";

export type ProjectMode = "portfolio" | "photobook";
export type ProjectStatus = "active" | "archived";

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
  template?: {
    id: string;
  };  // Optional template reference for future use
}

/** Payload the client sends to the createProject Cloud Function. */
export type CreateProjectPayload =
  | { mode: "portfolio"; name: string; template?: { id: string } }
  | { mode: "photobook"; name: string; template?: { id: string } };


export const PROJECT_NAME_MIN_LENGTH = 1;
export const PROJECT_NAME_MAX_LENGTH = 100;
export const VALID_MODES: ProjectMode[] = ["portfolio", "photobook"];
