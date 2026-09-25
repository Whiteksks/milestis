import { WandSparkles } from 'lucide-react'
import type { ModeRegistryEntry } from '@/editor/lib/modes/types'
import { useContentStore } from '@/editor/lib/store/content'
import type { MenuVisibility } from './content-types'
import { extractMenuDraft, restoreMenuDraft } from './draft'
import { createMenuSlice } from './store-slice'
import { MenuTemplateShell } from './menu-template-shell'
import { MenuClassic, MenuCoverPreview } from './templates/menu-classic'
import { MenuItemsSettings, MenuVenueSettings } from './section-settings/menu-settings'

export const menuMode: ModeRegistryEntry<keyof MenuVisibility> = {
  id: 'menu', label: 'Menu', defaultTemplateId: 'menu-classic', defaultActiveSectionId: 'venue',
  uiConfig: {
    backgroundLabelKey: 'editor.portfolio.ui.backgroundLabel', backgroundHintKey: 'editor.portfolio.ui.backgroundHint',
    backgroundIcon: WandSparkles, sectionsTabLabelKey: 'editor.menu.title',
    backgroundCatalogTitleKey: 'editor.portfolio.ui.backgroundCatalogTitle', backgroundCatalogMobileIcon: WandSparkles,
    backgroundCatalogMobileLabelKey: 'editor.portfolio.ui.backgroundCatalogMobileLabel',
    getActiveEffectsCount: (c) => [c.depthEffect, c.raysEffect, c.textureEffect].filter((v) => v && v !== 'none').length,
    resetEffects: (update) => update({ depthEffect: 'none', raysEffect: 'none', textureEffect: 'none', backgroundLayersTheme: 'dark', backgroundScrollMode: 'fixed' }),
    hideDecorations: true, hideAiButton: true,
  },
  createSlice: createMenuSlice,
  templates: [{ id: 'menu-classic', nameKey: 'editor.menu.templateName', previewComponent: MenuCoverPreview }],
  sections: [
    { id: 'venue', nameKey: 'editor.menu.venue', toggleKey: 'showVenue' },
    { id: 'menu', nameKey: 'editor.menu.title', toggleKey: 'showMenu' },
  ],
  getSettingsComponent: (id) => id === 'venue' ? MenuVenueSettings : id === 'menu' ? MenuItemsSettings : null,
  canvasDataSelector: () => ({}),
  renderCanvas: () => <MenuTemplateShell />,
  extractContent: extractMenuDraft,
  extractPreviewMeta: (s) => ({ title: s.menuContent.venue.name, subtitle: s.menuContent.venue.description, heroThumbUrl: s.menuImages.logo?.asset.blurDataUrl ?? s.menuImages.logo?.asset.src }),
  hydrateStore: (saved) => useContentStore.setState(restoreMenuDraft(saved)),
  renderPublished: ({ theme, content, imageContent, visibility }) => {
    const draft = restoreMenuDraft({ sectionContent: content, sectionVisibility: visibility, imageContent })
    return <MenuClassic theme={theme} content={draft.menuContent} images={draft.menuImages} visibility={draft.menuVisibility} />
  },
  visibilitySelector: (s) => s.menuVisibility,
  toggleSelector: (s) => s.toggleMenuSection,
}
