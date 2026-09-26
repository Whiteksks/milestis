'use client'

import { useEffect, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/editor/lib/store/ui'
import { useThemeStore } from '@/editor/lib/store/theme'
import { useContentStore } from '@/editor/lib/store/content'
import { PublishedView } from '@/app/sites/[slug]/published-view'
import { useActiveMenuPage } from '@/editor/modes/menu/use-active-menu-page'

export function PreviewOverlay() {
  const isPreviewOpen = useUiStore((s) => s.isPreviewOpen)
  const setIsPreviewOpen = useUiStore((s) => s.setIsPreviewOpen)
  const editorMode = useUiStore((s) => s.editorMode)
  const menuPage = useActiveMenuPage()
  const setMenuPage = useUiStore((s) => s.setActiveMenuPageId)

  const { currentTemplateId, currentTheme, themeCustomizations, customDecorations } =
    useThemeStore(useShallow((s) => ({
      currentTemplateId: s.currentTemplateId,
      currentTheme: s.currentTheme,
      themeCustomizations: s.themeCustomizations,
      customDecorations: s.customDecorations,
    })))

  const content = useContentStore((s) =>
    editorMode === 'menu' ? s.menuContent as unknown as Record<string, unknown> : editorMode === 'portfolio'
      ? s.sectionContent as unknown as Record<string, unknown>
      : editorMode === 'event'
        ? s.eventSectionContent as unknown as Record<string, unknown>
        : s.photobookSectionContent as unknown as Record<string, unknown>,
  )

  const imageContent = useContentStore((s) =>
    editorMode === 'menu' ? s.menuImages as unknown as Record<string, unknown> : editorMode === 'portfolio'
      ? s.portfolioImageContent as unknown as Record<string, unknown>
      : editorMode === 'event'
        ? undefined
        : s.photobookImageContent as unknown as Record<string, unknown>,
  )

  const visibility = useContentStore((s) =>
    editorMode === 'menu' ? s.menuVisibility as unknown as Record<string, unknown> : editorMode === 'portfolio'
      ? s.sectionVisibility as unknown as Record<string, unknown>
      : editorMode === 'event'
        ? s.eventSectionVisibility as unknown as Record<string, unknown>
        : s.photobookSectionVisibility as unknown as Record<string, unknown>,
  )

  // Close on Escape
  useEffect(() => {
    if (!isPreviewOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsPreviewOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isPreviewOpen, setIsPreviewOpen])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isPreviewOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isPreviewOpen])

  const handleClose = useCallback(() => setIsPreviewOpen(false), [setIsPreviewOpen])

  if (!isPreviewOpen) return null

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-background" data-scroll-root>
      <PublishedView
        pageId={editorMode === 'menu' ? menuPage.id : undefined}
        onPageChange={editorMode === 'menu' ? setMenuPage : undefined}
        mode={editorMode}
        templateId={currentTemplateId}
        themeId={currentTheme}
        themeCustomizations={themeCustomizations}
        customDecorations={customDecorations}
        content={content}
        imageContent={imageContent}
        visibility={visibility}
        clickable={false}
      />

      {/* Close button — floats above everything */}
      {/* On mobile: top-left so it doesn't overlap the burger menu in the template header */}
      <Button
        onClick={handleClose}
        size="icon"
        className="fixed top-4 left-4 sm:left-auto sm:right-8 z-[201] size-9 rounded-full shadow-lg"
        title="Close preview (Esc)"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}
