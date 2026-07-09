import type { EditorMode } from '@/editor/lib/editor-mode'
import type {
  ModeRegistryEntry,
  ModeUiConfig,
  ResolvedModeUiConfig,
  ResolvedSectionDef,
  ResolvedTemplateDef,
} from './types'
import { portfolioMode } from '@/editor/modes/portfolio'
import { photobookMode } from '@/editor/modes/photobook'
import { eventMode } from '@/editor/modes/event'

type TranslateFn = (key: string) => string

/** Ordered list of all registered modes.
 *  To add a new mode: create modes/<name>/index.ts and append it here.
 *  Also add the id to lib/editor-mode.ts — TypeScript will error on the mode's id field if you forget. */
export const ALL_MODES = [portfolioMode, photobookMode, eventMode] as const

/** Central dispatch map — built from ALL_MODES, stays in sync automatically. */
export const MODE_REGISTRY = Object.fromEntries(
  ALL_MODES.map(m => [m.id, m])
) as Record<EditorMode, ModeRegistryEntry<string>>

export function getModeTemplates(mode: EditorMode, t: TranslateFn): ResolvedTemplateDef[] {
  return MODE_REGISTRY[mode].templates.map((template) => ({
    ...template,
    name: t(template.nameKey),
    tags: template.tagKeys?.map((tagKey) => t(tagKey)),
  }))
}

export function getModeSections(mode: EditorMode, t: TranslateFn): ResolvedSectionDef[] {
  return MODE_REGISTRY[mode].sections.map((section) => ({
    ...section,
    name: t(section.nameKey),
  }))
}

export function getModeSectionCount(mode: EditorMode): number {
  return MODE_REGISTRY[mode].sections.length
}

/** Per-mode UI configuration map — derived from MODE_REGISTRY automatically. */
export const MODE_UI_CONFIGS: Record<EditorMode, ModeUiConfig> = Object.fromEntries(
  ALL_MODES.map(m => [m.id, m.uiConfig])
) as Record<EditorMode, ModeUiConfig>

export function getModeUiConfig(mode: EditorMode, t: TranslateFn): ResolvedModeUiConfig {
  const uiConfig = MODE_REGISTRY[mode].uiConfig

  return {
    ...uiConfig,
    backgroundLabel: t(uiConfig.backgroundLabelKey),
    backgroundHint: t(uiConfig.backgroundHintKey),
    sectionsTabLabel: t(uiConfig.sectionsTabLabelKey),
    backgroundCatalogTitle: t(uiConfig.backgroundCatalogTitleKey),
    backgroundCatalogMobileLabel: t(uiConfig.backgroundCatalogMobileLabelKey),
  }
}
