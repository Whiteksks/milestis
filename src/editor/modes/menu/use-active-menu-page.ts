'use client'

import { useContentStore } from '@/editor/lib/store/content'
import { useUiStore } from '@/editor/lib/store/ui'

/** Stale selections (e.g. after deletion) resolve to the home page without writing content. */
export function useActiveMenuPage() {
  const selectedId = useUiStore((s) => s.activeMenuPageId)
  return useContentStore((s) => s.menuContent.pages.find((page) => page.id === selectedId)
    ?? s.menuContent.pages.find((page) => page.id === s.menuContent.homePageId)!)
}
