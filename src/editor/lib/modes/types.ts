import type { ThemeConfig } from '@/editor/lib/themes'
import type {
  PhotobookSectionContent,
  PhotobookSectionVisibility,
  TemplateId,
} from '@/editor/lib/types'
import type { ContentStore } from '@/editor/lib/store-content'

import type React from 'react'

export type TemplateDef = {
  id: TemplateId
  name: string
  description?: string
  thumbnail?: string
  tags?: string[]
  /** Hero / Cover component used by TemplatePreview. Co-located here so adding
   *  a template only requires editing one file. */
  previewComponent?: React.ComponentType<any>
}

export type SectionDef<K extends string = string> = {
  id: string
  name: string
  toggleKey: K
}

/** Base args always available for every mode.
 *  Mode-specific fields are optional here — each mode provides them via canvasDataSelector. */
export type CanvasRenderArgs = {
  templateId: TemplateId
  theme: ThemeConfig
  // Photobook-specific — always present when photobook mode is active
  photobookSectionContent?: PhotobookSectionContent
  photobookSectionVisibility?: PhotobookSectionVisibility
}

export type ModeRegistryEntry<TVisibilityKey extends string> = {
  label: string
  templates: TemplateDef[]
  sections: SectionDef<TVisibilityKey>[]
  defaultActiveSectionId: string

  getSettingsComponent: (sectionId: string) => React.ComponentType | null

  /** Extracts mode-specific data from ContentStore to spread into renderCanvas args.
   *  Canvas subscribes only to this mode's slices — no cross-mode subscriptions. */
  canvasDataSelector: (s: ContentStore) => Partial<CanvasRenderArgs>

  renderCanvas: (args: CanvasRenderArgs) => React.ReactNode

  /** Extracts this mode's section visibility from ContentStore. */
  visibilitySelector: (s: ContentStore) => Record<TVisibilityKey, boolean>

  /** Extracts this mode's toggle action from ContentStore. */
  toggleSelector: (s: ContentStore) => (key: TVisibilityKey) => void
}
