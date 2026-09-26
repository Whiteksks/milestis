import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { ThemeCustomizations } from '@/editor/lib/store/theme'
import type { MenuContent, MenuImageContent, MenuVisibility } from '../content-types'

export interface MenuTemplateProps {
  theme: ThemeConfig
  visual?: ThemeCustomizations
  content: MenuContent
  images: MenuImageContent
  visibility: MenuVisibility
  editing?: boolean
  pageId?: string
  onPageChange?: (pageId: string) => void
  projectId?: string
}
