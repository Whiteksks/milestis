/**
 * Project persistence schema
 *
 * This file defines the complete shape of a project document as it will be
 * stored in Firestore. All editor stores (UiStore, ThemeStore, ContentStore)
 * are serialised into this structure when saving and rehydrated from it when
 * loading.
 *
 * Firestore path (planned):
 *   projects/{projectId}
 */

import type {
  EditorMode,
  Theme,
  TemplateId,
  SectionContent,
  SectionVisibility,
  PhotobookSectionContent,
  PhotobookSectionVisibility,
  ThemeCustomDecorations,
} from './types'
import type { ThemeCustomizations } from './store-theme'

// ─── Metadata ─────────────────────────────────────────────────────────────

export interface ProjectMeta {
  /** Firestore document ID */
  id: string
  /** UID of the owning user (Firebase Auth) */
  ownerId: string
  /** Human-readable project name set by the user */
  name: string
  /** Determines which content/template set this project uses. Immutable after creation. */
  mode: EditorMode
  createdAt: number   // Unix ms — Firestore Timestamp converts to this on read
  updatedAt: number
}

// ─── Theme snapshot ─────────────────────────────────────────────────────────

export interface ProjectThemeData {
  currentTemplateId: TemplateId
  currentTheme: Theme
  themeCustomizations: ThemeCustomizations
  customDecorations: ThemeCustomDecorations[]
}

// ─── Mode-specific content ────────────────────────────────────────────────

export interface PortfolioProjectContent {
  sectionVisibility: SectionVisibility
  sectionContent: SectionContent
  /**
   * Images are stored in Firebase Storage and their metadata lives in
   * users/{userId}/media — not inside the project document.
   * Section fields like hero.image / bio.image store a download URL reference.
   */
}

export interface PhotobookProjectContent {
  sectionVisibility: PhotobookSectionVisibility
  sectionContent: PhotobookSectionContent
}

// ─── Full project document (discriminated union) ──────────────────────────

export interface PortfolioProject extends ProjectMeta {
  mode: 'portfolio'
  /** Absent on freshly-created projects — editor uses store defaults until first save. */
  theme?: ProjectThemeData
  /** Absent on freshly-created projects — editor uses store defaults until first save. */
  content?: PortfolioProjectContent
}

export interface PhotobookProject extends ProjectMeta {
  mode: 'photobook'
  /** Absent on freshly-created projects — editor uses store defaults until first save. */
  theme?: ProjectThemeData
  /** Absent on freshly-created projects — editor uses store defaults until first save. */
  content?: PhotobookProjectContent
}

/** The union type used everywhere in the app when referring to a project. */
export type EditorProject = PortfolioProject | PhotobookProject

// ─── Type guards ─────────────────────────────────────────────────────────

export function isPortfolioProject(p: EditorProject): p is PortfolioProject {
  return p.mode === 'portfolio'
}

export function isPhotobookProject(p: EditorProject): p is PhotobookProject {
  return p.mode === 'photobook'
}

// ─── Minimal creation payload ─────────────────────────────────────────────

/** Passed to the "create project" Firebase Function — server fills in id, userId, timestamps. */
export type CreateProjectPayload =
  | { mode: 'portfolio'; name: string }
  | { mode: 'photobook'; name: string }
