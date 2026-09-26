import { resolveMenuTemplateId, type MenuTemplateId } from '../template-ids'
import { MenuClassic, MenuCoverPreview } from './menu-classic'
import { MenuBistro, MenuBistroPreview } from './menu-bistro'
import { MenuPicnic, MenuPicnicPreview } from './menu-picnic'
import { MenuGallery, MenuGalleryPreview } from './menu-gallery'
import { MenuPulse, MenuPulsePreview } from './menu-pulse'

export const MENU_TEMPLATES = {
  'menu-classic': { nameKey: 'editor.menu.templateName', component: MenuClassic, previewComponent: MenuCoverPreview },
  'menu-bistro': { nameKey: 'editor.menu.bistroTemplateName', component: MenuBistro, previewComponent: MenuBistroPreview },
  'menu-picnic': { nameKey: 'editor.menu.picnicTemplateName', component: MenuPicnic, previewComponent: MenuPicnicPreview },
  'menu-gallery': { nameKey: 'editor.menu.galleryTemplateName', component: MenuGallery, previewComponent: MenuGalleryPreview },
  'menu-pulse': { nameKey: 'editor.menu.pulseTemplateName', component: MenuPulse, previewComponent: MenuPulsePreview },
} satisfies Record<MenuTemplateId, { nameKey: string; component: typeof MenuClassic; previewComponent: typeof MenuCoverPreview }>

export function getMenuTemplate(id: unknown) {
  return MENU_TEMPLATES[resolveMenuTemplateId(id)]
}
