import type { EditorMode } from '@/editor/lib/types'
import { portfolioMode } from './portfolio'
import { photobookMode } from './photobook'

export type { TemplateDef, SectionDef, CanvasRenderArgs, ModeRegistryEntry } from './types'
export type { PortfolioTemplateId } from './portfolio-ids'
export type { PhotobookTemplateId }  from './photobook-ids'

export const MODE_REGISTRY: {
  portfolio: (typeof portfolioMode)
  photobook: (typeof photobookMode)
} = {
  portfolio: portfolioMode,
  photobook: photobookMode,
}

// Helpers used by consumers — return types are intentionally wide so callers
// don't need to know the concrete TVisibilityKey of each mode.
export function getModeTemplates(mode: EditorMode) {
  return MODE_REGISTRY[mode].templates
}

export function getModeSections(mode: EditorMode) {
  return MODE_REGISTRY[mode].sections
}

export function getModeSectionCount(mode: EditorMode): number {
  return MODE_REGISTRY[mode].sections.length
}

// Re-export mode entries individually so new modes can be imported directly.
export { portfolioMode } from './portfolio'
export { photobookMode } from './photobook'
