'use client'

import { useContentSelector, useThemeSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/config/themes'
import { MenuClassic } from './templates/menu-classic'
import { useActiveMenuPage } from './use-active-menu-page'
import { useUiStore } from '@/editor/lib/store/ui'

export function MenuTemplateShell() {
  const { content, visibility, images } = useContentSelector((s) => ({ content: s.menuContent, visibility: s.menuVisibility, images: s.menuImages }))
  const themeId = useThemeSelector((s) => s.currentTheme)
  const page = useActiveMenuPage()
  return <MenuClassic key={page.id} pageId={page.id} onPageChange={(id) => {
    const ui = useUiStore.getState()
    ui.setActiveMenuPageId(id)
    ui.setActiveSectionId('menu')
    ui.closeMediaPicker()
  }} theme={getTheme(themeId)} content={content} visibility={visibility} images={images} editing />
}
