export type { TemplateDef, SectionDef, CanvasRenderArgs, PublishedRenderArgs, ModeRegistryEntry, ModeUiConfig } from './types'
export type { PortfolioTemplateId } from '@/editor/modes/portfolio/template-ids'
export type { PhotobookTemplateId } from '@/editor/modes/photobook/template-ids'

export { ALL_MODES, MODE_REGISTRY, getModeTemplates, getModeSections, getModeSectionCount, getModeUiConfig, MODE_UI_CONFIGS } from './registry'

// Individual mode exports for direct imports
export { portfolioMode } from '@/editor/modes/portfolio'
export { photobookMode } from '@/editor/modes/photobook'
