"use client"

import { useMemo, useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer'

import { useThemeSelector, useUiSelector } from '@/editor/lib/store'
import { themes } from '@/editor/lib/themes'
import { BACKGROUND_PRESETS } from '@/editor/lib/background-presets'
import type { BackgroundPreset } from '@/editor/lib/background-presets'
import { getModeSectionCount, getModeTemplates } from '@/editor/lib/mode-registry'
import type { TemplateId, Theme } from '@/editor/lib/types'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { LayoutTemplate, Palette, WandSparkles } from 'lucide-react'

import type { DesignCatalogSection } from './types'
import { DesignCatalogSidebar } from './design-catalog-sidebar'
import { DesignCatalogFooter } from './design-catalog-footer'
import { BackgroundsSection, ThemesSection, TemplatesSection } from './sections'

export function DesignCatalogModal() {
  const {
    isDesignModalOpen,
    designModalSection,
    setDesignModalSection,
    closeDesignModal,
    clearPreviewDecorations,
    editorMode,
  } = useUiSelector((state) => ({
    isDesignModalOpen: state.isDesignModalOpen,
    designModalSection: state.designModalSection,
    setDesignModalSection: state.setDesignModalSection,
    closeDesignModal: state.closeDesignModal,
    clearPreviewDecorations: state.clearPreviewDecorations,
    editorMode: state.editorMode,
  }))

  const {
    currentTheme,
    currentTemplateId,
    setTheme,
    setTemplate,
    updateThemeCustomization,
  } = useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
    currentTemplateId: state.currentTemplateId,
    setTheme: state.setTheme,
    setTemplate: state.setTemplate,
    updateThemeCustomization: state.updateThemeCustomization,
  }))

  const [activeTag, setActiveTag] = useState<string>('all')
  const [selectedTemplatesId, setSelectedTemplatesId] = useState<string | null>(null)
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string | null>(null)

  const templates = useMemo(() => getModeTemplates(editorMode), [editorMode])
  const templateSectionCount = useMemo(() => getModeSectionCount(editorMode), [editorMode])

  const effectiveSelectedTemplatesId = selectedTemplatesId ?? currentTemplateId ?? null
  const effectiveSelectedThemeId = selectedThemeId ?? currentTheme ?? null
  const effectiveSelectedBackgroundId = selectedBackgroundId ?? null

  const itemsForSection = useMemo(() => {
    if (designModalSection === 'templates') return templates
    if (designModalSection === 'themes') return themes
    return BACKGROUND_PRESETS
  }, [designModalSection, templates])

  const sectionTitle = useMemo(() => {
    switch (designModalSection) {
      case 'templates':
        return 'Templates'
      case 'themes':
        return 'Themes'
      case 'backgrounds':
        return 'Background Effects'
    }
  }, [designModalSection])

  const tagMeta = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of itemsForSection as Array<{ tags?: string[] }>) {
      for (const tag of item.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
    const availableTags = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b))
    return { availableTags, counts }
  }, [itemsForSection])

  const visibleItems = useMemo(() => {
    if (activeTag === 'all') return itemsForSection
    return (itemsForSection as Array<{ tags?: string[] }>).filter((item) => (item.tags ?? []).includes(activeTag))
  }, [activeTag, itemsForSection])

  const activeTagLabel = activeTag === 'all' ? 'All' : activeTag

  const handleClose = () => {
    clearPreviewDecorations()
    setActiveTag('all')
    closeDesignModal()
  }

  const onSectionChange = (section: DesignCatalogSection) => {
    setDesignModalSection(section)
    setActiveTag('all')
  }

  const applySelected = () => {
    if (designModalSection === 'templates') {
      if (!effectiveSelectedTemplatesId) return
      setTemplate(effectiveSelectedTemplatesId as TemplateId)
      handleClose()
      return
    }

    if (designModalSection === 'themes') {
      if (!effectiveSelectedThemeId) return
      setTheme(effectiveSelectedThemeId as Theme)
      handleClose()
      return
    }

    if (designModalSection === 'backgrounds') {
      if (!effectiveSelectedBackgroundId) return
      const preset = BACKGROUND_PRESETS.find((p) => p.id === effectiveSelectedBackgroundId)
      if (!preset) return

      updateThemeCustomization({
        depthEffect: preset.depth,
        raysEffect: preset.rays,
        textureEffect: preset.texture,
        backgroundLayersTheme: preset.theme,
      })

      handleClose()
    }
  }

  const isApplyDisabled =
    (designModalSection === 'templates' && !effectiveSelectedTemplatesId) ||
    (designModalSection === 'themes' && !effectiveSelectedThemeId) ||
    (designModalSection === 'backgrounds' && !effectiveSelectedBackgroundId)

  const selectedLabel = useMemo(() => {
    if (designModalSection === 'templates') {
      if (!effectiveSelectedTemplatesId) return null
      return (
        templates.find((t) => t.id === effectiveSelectedTemplatesId)?.name ??
        effectiveSelectedTemplatesId
      )
    }
    if (designModalSection === 'themes') {
      if (!effectiveSelectedThemeId) return null
      return themes.find((t) => t.id === effectiveSelectedThemeId)?.name ?? effectiveSelectedThemeId
    }
    if (designModalSection === 'backgrounds') {
      if (!effectiveSelectedBackgroundId) return null
      return BACKGROUND_PRESETS.find((p) => p.id === effectiveSelectedBackgroundId)?.name ?? effectiveSelectedBackgroundId
    }
    return null
  }, [
    designModalSection,
    effectiveSelectedTemplatesId,
    effectiveSelectedThemeId,
    effectiveSelectedBackgroundId,
    templates,
  ])

  const isMobile = useIsMobile()

  // Shared section content — same JSX for both mobile and desktop
  const sectionContent = (
    <>
      {designModalSection === 'templates' && (
        <TemplatesSection
          items={visibleItems as typeof templates}
          selectedId={effectiveSelectedTemplatesId}
          onSelect={setSelectedTemplatesId}
          sectionCount={templateSectionCount}
        />
      )}
      {designModalSection === 'themes' && (
        <ThemesSection
          items={visibleItems as typeof themes}
          selectedId={effectiveSelectedThemeId}
          onSelect={setSelectedThemeId}
        />
      )}
      {designModalSection === 'backgrounds' && (
        <BackgroundsSection
          items={visibleItems as BackgroundPreset[]}
          selectedId={effectiveSelectedBackgroundId}
          onSelect={setSelectedBackgroundId}
        />
      )}
    </>
  )

  // ── MOBILE: Drawer ──────────────────────────────────────────────
  if (isMobile) {
    const mobileSections = [
      { id: 'templates' as const, icon: LayoutTemplate, label: 'Templates' },
      { id: 'themes' as const, icon: Palette, label: 'Themes' },
      { id: 'backgrounds' as const, icon: WandSparkles, label: 'Background' },
    ]

    return (
      <Drawer
        open={isDesignModalOpen}
        onOpenChange={(open) => {
          if (open) {
            ;(document.activeElement as HTMLElement | null)?.blur()
          } else {
            handleClose()
          }
        }}
      >
        <DrawerContent className="md:hidden flex flex-col bg-card border-border/60 focus:outline-none">
          <DrawerTitle className="sr-only">Design Catalog</DrawerTitle>
          <DrawerDescription className="sr-only">Choose a template, theme, and background effects.</DrawerDescription>

          {/* Section switcher — horizontal tabs */}
          <div className="shrink-0 px-4 pt-1 pb-0">
            <div className="flex gap-1">
              {mobileSections.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => onSectionChange(id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    designModalSection === id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tag filter chips — horizontal scroll, no reflow */}
          {tagMeta.availableTags.length > 0 && (
            <div className="shrink-0 px-4 pt-3 pb-1">
              <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                <button
                  onClick={() => setActiveTag('all')}
                  className={cn(
                    'shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    activeTag === 'all'
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  All ({itemsForSection.length})
                </button>
                {tagMeta.availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      'shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      activeTag === tag
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tag} ({tagMeta.counts.get(tag)})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable content — overscroll-contain keeps vaul drag working */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
            {sectionContent}
          </div>

          {/* Sticky footer */}
          <DesignCatalogFooter
            selectedLabel={selectedLabel}
            isApplyDisabled={isApplyDisabled}
            onCancel={handleClose}
            onApply={applySelected}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  // ── DESKTOP: Dialog ─────────────────────────────────────────────
  return (
    <Dialog
      open={isDesignModalOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <DialogTitle className="sr-only">Design Catalog</DialogTitle>
      <DialogDescription className="sr-only">Choose a template, theme, and decorations.</DialogDescription>

      <DialogContent
        className="
          w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)]
          max-w-5xl
          h-[calc(100vh-2rem)] sm:h-[85vh]
          flex flex-col
          bg-background
          border-border
          p-0 gap-0
          overflow-hidden
        "
      >
        <div className="flex flex-col md:flex-row h-full min-h-0">
          <DesignCatalogSidebar
            section={designModalSection}
            onSectionChange={onSectionChange}
            tagMeta={tagMeta}
            activeTag={activeTag}
            onTagChange={setActiveTag}
            activeTagLabel={activeTagLabel}
            totalCount={itemsForSection.length}
            visibleCount={visibleItems.length}
          />

          <main className="flex-1 flex flex-col min-h-0 min-w-0">
            <header className="shrink-0 px-4 md:px-6 py-4 border-b border-border flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground tracking-tight truncate">{sectionTitle}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {designModalSection === 'templates'
                    ? `${visibleItems.length} templates`
                    : designModalSection === 'themes'
                      ? `${visibleItems.length} themes`
                      : `${visibleItems.length} presets`}
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {sectionContent}
            </div>

            <DesignCatalogFooter
              selectedLabel={selectedLabel}
              isApplyDisabled={isApplyDisabled}
              onCancel={handleClose}
              onApply={applySelected}
            />
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DesignCatalogModal
