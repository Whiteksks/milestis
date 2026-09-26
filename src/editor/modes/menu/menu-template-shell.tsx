'use client'

import { useContentSelector, useThemeSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/config/themes'
import { getMenuTemplate } from './templates/registry'
import { useActiveMenuPage } from './use-active-menu-page'
import { useUiStore } from '@/editor/lib/store/ui'

export function MenuTemplateShell({ templateId }: { templateId: string }) {
  const { content, visibility, images } = useContentSelector((s) => ({ content: s.menuContent, visibility: s.menuVisibility, images: s.menuImages }))
  const { themeId, visual } = useThemeSelector((s) => ({ themeId: s.currentTheme, visual: s.themeCustomizations }))
  const page = useActiveMenuPage()
  const Template = getMenuTemplate(templateId).component
  return <Template key={page.id} pageId={page.id} onPageChange={(id) => {
    const ui = useUiStore.getState()
    ui.setActiveMenuPageId(id)
    ui.setActiveSectionId('menu')
    ui.closeMediaPicker()
  }} theme={getTheme(themeId)} visual={visual} content={content} visibility={visibility} images={images} editing />
}
