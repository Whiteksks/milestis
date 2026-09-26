import { Layers } from 'lucide-react'
import type { ModeRegistryEntry } from '@/editor/lib/modes/types'
import { useContentStore } from '@/editor/lib/store/content'
import type { MenuVisibility } from './content-types'
import { extractMenuDraft, restoreMenuDraft } from './draft'
import { createMenuSlice } from './store-slice'
import { MenuTemplateShell } from './menu-template-shell'
import { getMenuTemplate, MENU_TEMPLATES } from './templates/registry'
import { MENU_TEMPLATE_IDS } from './template-ids'
import { MenuItemsSettings, MenuVenueSettings } from './section-settings/menu-settings'

export const menuMode: ModeRegistryEntry<keyof MenuVisibility> = {
  id: 'menu', label: 'Menu', defaultTemplateId: 'menu-classic', defaultActiveSectionId: 'venue',
  uiConfig: {
    backgroundLabelKey: 'editor.menu.appearance.title', backgroundHintKey: 'editor.menu.appearance.hint',
    backgroundIcon: Layers, sectionsTabLabelKey: 'editor.menu.title',
    backgroundCatalogTitleKey: 'editor.menu.appearance.title', backgroundCatalogMobileIcon: Layers,
    backgroundCatalogMobileLabelKey: 'editor.menu.appearance.mobileLabel',
    getActiveEffectsCount: (c) => [c.photobookMood, c.photobookTexture].filter((v) => v && v !== 'none').length,
    resetEffects: (update) => update({ photobookMood: 'none', photobookTexture: 'none' }),
    hideDecorations: true,
  },
  createSlice: createMenuSlice,
  templates: MENU_TEMPLATE_IDS.map((id) => ({ id, nameKey: MENU_TEMPLATES[id].nameKey, previewComponent: MENU_TEMPLATES[id].previewComponent })),
  sections: [
    { id: 'venue', nameKey: 'editor.menu.venue', toggleKey: 'showVenue' },
    { id: 'menu', nameKey: 'editor.menu.title', toggleKey: 'showMenu' },
  ],
  getSettingsComponent: (id) => id === 'venue' ? MenuVenueSettings : id === 'menu' ? MenuItemsSettings : null,
  canvasDataSelector: () => ({}),
  renderCanvas: ({ templateId }) => <MenuTemplateShell templateId={templateId} />,
  extractContent: extractMenuDraft,
  extractPreviewMeta: (s) => ({ title: s.menuContent.venue.name, subtitle: s.menuContent.venue.description, heroThumbUrl: s.menuImages.logo?.asset.blurDataUrl ?? s.menuImages.logo?.asset.src }),
  hydrateStore: (saved) => useContentStore.setState(restoreMenuDraft(saved)),
  renderPublished: ({ templateId, theme, themeCustomizations, content, imageContent, visibility, pageId, onPageChange, projectId }) => {
    const draft = restoreMenuDraft({ sectionContent: content, sectionVisibility: visibility, imageContent })
    const Template = getMenuTemplate(templateId).component
    return <Template pageId={pageId} onPageChange={onPageChange} projectId={projectId} theme={theme} visual={themeCustomizations} content={draft.menuContent} images={draft.menuImages} visibility={draft.menuVisibility} />
  },
  visibilitySelector: (s) => s.menuVisibility,
  toggleSelector: (s) => s.toggleMenuSection,
}
