import type { ModeContent } from '@/editor/lib/modes/types'
import type { MenuImageContent, MenuVisibility } from './content-types'
import type { MenuSlice } from './store-slice'
import { normalizeMenuContent } from './model'

type MenuDraftState = Pick<MenuSlice, 'menuContent' | 'menuImages' | 'menuVisibility'>

export function extractMenuDraft(state: MenuDraftState): ModeContent {
  return { sectionContent: state.menuContent, sectionVisibility: state.menuVisibility, imageContent: state.menuImages }
}

export function restoreMenuDraft(saved: ModeContent | null): MenuDraftState {
  const content = normalizeMenuContent(saved?.sectionContent)
  const images = saved?.imageContent as MenuImageContent | undefined
  const visibility = saved?.sectionVisibility as Partial<MenuVisibility> | undefined
  return {
    menuContent: content,
    menuVisibility: { showVenue: visibility?.showVenue !== false, showMenu: visibility?.showMenu !== false },
    menuImages: {
      logo: images?.logo?.asset?.src ? images.logo : undefined,
      dishes: Object.fromEntries(content.dishes.flatMap((dish) => {
        const image = images?.dishes?.[dish.id]
        return image?.asset?.src ? [[dish.id, image]] : []
      })),
    },
  }
}
