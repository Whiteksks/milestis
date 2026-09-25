'use client'

import { useContentSelector, useThemeSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/config/themes'
import { MenuClassic } from './templates/menu-classic'

export function MenuTemplateShell() {
  const { content, visibility, images } = useContentSelector((s) => ({ content: s.menuContent, visibility: s.menuVisibility, images: s.menuImages }))
  const themeId = useThemeSelector((s) => s.currentTheme)
  return <MenuClassic theme={getTheme(themeId)} content={content} visibility={visibility} images={images} editing />
}
