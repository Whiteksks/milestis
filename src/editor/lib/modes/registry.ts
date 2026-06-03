import type { EditorMode } from '@/editor/lib/editor-mode'
import type { ModeRegistryEntry, ModeUiConfig } from './types'
import { portfolioMode } from '@/editor/modes/portfolio'
import { photobookMode } from '@/editor/modes/photobook'

/** Ordered list of all registered modes.
 *  To add a new mode: create modes/<name>/index.ts and append it here.
 *  Also add the id to lib/editor-mode.ts — TypeScript will error on the mode's id field if you forget. */
export const ALL_MODES = [portfolioMode, photobookMode] as const

/** Central dispatch map — built from ALL_MODES, stays in sync automatically. */
export const MODE_REGISTRY = Object.fromEntries(
  ALL_MODES.map(m => [m.id, m])
) as Record<EditorMode, ModeRegistryEntry<string>>

export function getModeTemplates(mode: EditorMode) {
  return MODE_REGISTRY[mode].templates
}

export function getModeSections(mode: EditorMode) {
  return MODE_REGISTRY[mode].sections
}

export function getModeSectionCount(mode: EditorMode): number {
  return MODE_REGISTRY[mode].sections.length
}

/** Per-mode UI configuration map — derived from MODE_REGISTRY automatically. */
export const MODE_UI_CONFIGS: Record<EditorMode, ModeUiConfig> = Object.fromEntries(
  ALL_MODES.map(m => [m.id, m.uiConfig])
) as Record<EditorMode, ModeUiConfig>

export function getModeUiConfig(mode: EditorMode): ModeUiConfig {
  return MODE_REGISTRY[mode].uiConfig
}
