/**
 * Project persistence schema
 *
 * This file defines the complete shape of a project document as it will be
 * stored in Firestore. All editor stores (UiStore, ThemeStore, ContentStore)
 * are serialised into this structure when saving and rehydrated from it when
 * loading.
 *
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
import type { PortfolioImageContent } from '@/editor/image/portfolio/content'
import type { PhotobookImageContent } from '@/editor/image/photobook/content'

// ─── Metadata 

export interface ProjectMeta {
  id: string   /** Firestore document ID */
  ownerId: string   /** UID of the owning user (Firebase Auth) */
  name: string  /** Human-readable project name set by the user */
  mode: EditorMode   /** Determines which content/template set this project uses. Immutable after creation. */
  createdAt: number   // Unix ms — Firestore Timestamp converts to this on read
  updatedAt: number
}

// ─── Theme snapshot 

export interface ProjectThemeData {
  currentTemplateId: TemplateId
  currentTheme: Theme
  themeCustomizations: ThemeCustomizations
  customDecorations: ThemeCustomDecorations[]
}

// ─── Mode-specific content 

export interface PortfolioProjectContent {
  sectionVisibility: SectionVisibility
  sectionContent: SectionContent
  imageContent?: PortfolioImageContent
}

export interface PhotobookProjectContent {
  sectionVisibility: PhotobookSectionVisibility
  sectionContent: PhotobookSectionContent
  imageContent?: PhotobookImageContent
}

// ─── Full project document (discriminated union) 

export interface PortfolioProject extends ProjectMeta {
  mode: 'portfolio'
  theme?: ProjectThemeData
  content?: PortfolioProjectContent
}

export interface PhotobookProject extends ProjectMeta {
  mode: 'photobook'
  theme?: ProjectThemeData
  content?: PhotobookProjectContent
}

/** The union type used everywhere in the app when referring to a project. */
export type EditorProject = PortfolioProject | PhotobookProject

// ─── Type guards 

export function isPortfolioProject(p: EditorProject): p is PortfolioProject {
  return p.mode === 'portfolio'
}

export function isPhotobookProject(p: EditorProject): p is PhotobookProject {
  return p.mode === 'photobook'
}

// ─── Minimal creation payload

/** Passed to the "create project" Firebase Function — server fills in id, userId, timestamps. */
export type CreateProjectPayload =
  | { mode: 'portfolio'; name: string }
  | { mode: 'photobook'; name: string }
