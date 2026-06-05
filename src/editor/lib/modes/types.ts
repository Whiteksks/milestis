import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { TemplateId } from '@/editor/lib/types'
import type { EditorMode } from '@/editor/lib/editor-mode'
import type { ContentStore } from '@/editor/lib/store/content'
import type { ThemeCustomizations } from '@/editor/lib/store/theme'
import type { StateCreator } from 'zustand'
import type { LucideIcon } from 'lucide-react'

import type React from 'react'

export type TranslationKey = string

/** Serializable content snapshot saved to / loaded from Firestore. */
export type ModeContent = {
  sectionVisibility: unknown
  sectionContent: unknown
  imageContent: unknown
}

/** Metadata extracted for the dashboard project card. */
export type ModePreviewMeta = {
  heroThumbUrl?: string
  title?: string
  subtitle?: string
  date?: string
  aspectRatio?: string
  frameStyle?: string
}

/** Args passed to each mode's `renderPublished` — no Zustand, data comes from props. */
export type PublishedRenderArgs = {
  templateId: string
  theme: ThemeConfig
  themeCustomizations: ThemeCustomizations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageContent?: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visibility: Record<string, any>
  handleAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
}

export type TemplateDef = {
  id: TemplateId
  nameKey: TranslationKey
  description?: string
  thumbnail?: string
  tagKeys?: TranslationKey[]
  /** Hero / Cover component used by TemplatePreview. Co-located here so adding
   *  a template only requires editing one file. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previewComponent?: React.ComponentType<any>
}

export type SectionDef<K extends string = string> = {
  id: string
  nameKey: TranslationKey
  toggleKey: K
}

export type ResolvedTemplateDef = Omit<TemplateDef, 'nameKey' | 'tagKeys'> & {
  name: string
  tags?: string[]
}

export type ResolvedSectionDef<K extends string = string> = Omit<SectionDef<K>, 'nameKey'> & {
  name: string
}

/** Args passed to renderCanvas — common fields for every mode.
 *  Each mode's shell reads its own content directly from the store. */
export type CanvasRenderArgs = {
  templateId: TemplateId
  theme: ThemeConfig
}

/** All UI-related configuration for a mode.
 *  Lives inside the mode's registration object so adding a new mode
 *  does not require touching any shared config file. */
export interface ModeUiConfig {
  /** Sidebar / panel header label for the backgrounds / effects section. */
  backgroundLabelKey: TranslationKey
  /** Subtitle line shown when no effects are active. */
  backgroundHintKey: TranslationKey
  /** Icon rendered next to the background label. */
  backgroundIcon: LucideIcon

  /** Tab label in the left sections sidebar. */
  sectionsTabLabelKey: TranslationKey

  /** Section-title shown inside the design catalog modal. */
  backgroundCatalogTitleKey: TranslationKey
  /** Icon for the backgrounds tab in the mobile design catalog drawer. */
  backgroundCatalogMobileIcon: LucideIcon
  /** Label for the backgrounds tab in the mobile design catalog drawer. */
  backgroundCatalogMobileLabelKey: TranslationKey

  /** Returns the number of currently-active background effects for this mode. */
  getActiveEffectsCount: (c: Partial<ThemeCustomizations>) => number
  /** Resets all background effects for this mode.
   *  @param update — the `updateThemeCustomization` action from the theme store. */
  resetEffects: (update: (patch: Partial<ThemeCustomizations>) => void) => void
}

export type ResolvedModeUiConfig = Omit<
  ModeUiConfig,
  | 'backgroundLabelKey'
  | 'backgroundHintKey'
  | 'sectionsTabLabelKey'
  | 'backgroundCatalogTitleKey'
  | 'backgroundCatalogMobileLabelKey'
> & {
  backgroundLabel: string
  backgroundHint: string
  sectionsTabLabel: string
  backgroundCatalogTitle: string
  backgroundCatalogMobileLabel: string
}

export type ModeRegistryEntry<TVisibilityKey extends string> = {
  /** Must be a valid EditorMode — TypeScript will error here if you forget to add it to lib/editor-mode.ts. */
  id: EditorMode

  /** All UI configuration for this mode. No shared config file needed for new modes. */
  uiConfig: ModeUiConfig

  /** Zustand slice factory — ContentStore auto-composes from all registered modes. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createSlice: StateCreator<ContentStore, [], [], any>

  label: string
  /** Fallback template id used when a project has no saved template yet. */
  defaultTemplateId: string
  templates: TemplateDef[]
  sections: SectionDef<TVisibilityKey>[]
  defaultActiveSectionId: string

  getSettingsComponent: (sectionId: string) => React.ComponentType | null

  /** Extracts mode-specific data from ContentStore to spread into renderCanvas args.
   *  Canvas subscribes only to this mode's slices — no cross-mode subscriptions. */
  canvasDataSelector: (s: ContentStore) => Partial<CanvasRenderArgs>

  renderCanvas: (args: CanvasRenderArgs) => React.ReactNode

  /** Renders the template with explicit props (for the published site — no Zustand). */
  renderPublished: (args: PublishedRenderArgs) => React.ReactNode

  /** Extracts this mode's content from the store for saving to Firestore. */
  extractContent: (store: ContentStore) => ModeContent
  /** Extracts preview card metadata (title, hero thumb, etc.) for the dashboard. */
  extractPreviewMeta: (store: ContentStore) => ModePreviewMeta
  /** Hydrates the content store. Pass null for a new project — defaults will be applied. */
  hydrateStore: (savedContent: ModeContent | null) => void

  /** Extracts this mode's section visibility from ContentStore. */
  visibilitySelector: (s: ContentStore) => Record<TVisibilityKey, boolean>

  /** Extracts this mode's toggle action from ContentStore. */
  toggleSelector: (s: ContentStore) => (key: TVisibilityKey) => void
}
