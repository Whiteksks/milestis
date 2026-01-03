"use client"

import { useEffect, useMemo, useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

import { useThemeSelector, useUiSelector } from '@/editor/lib/store'
import { themes } from '@/editor/lib/themes'
import { decorationPresets, getDecorationById, themeToPreset } from '@/editor/lib/decorations'
import { getModeSectionCount, getModeTemplates } from '@/editor/lib/mode-registry'
import type { TemplateId, Theme } from '@/editor/lib/types'

import type { DesignCatalogSection } from './types'
import { DesignCatalogSidebar } from './design-catalog-sidebar'
import { DesignCatalogFooter } from './design-catalog-footer'
import { DecorationsSection, ThemesSection, TemplatesSection, getDecorationName } from './sections'

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
    setDecorations,
    updateThemeCustomization,
  } = useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
    currentTemplateId: state.currentTemplateId,
    setTheme: state.setTheme,
    setTemplate: state.setTemplate,
    setDecorations: state.setDecorations,
    updateThemeCustomization: state.updateThemeCustomization,
  }))

  const [activeTag, setActiveTag] = useState<string>('all')
  const [selectedTemplatesId, setSelectedTemplatesId] = useState<string | null>(null)
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
  const [selectedDecorationPresetId, setSelectedDecorationPresetId] = useState<string | null>(null)

  const templates = useMemo(() => getModeTemplates(editorMode), [editorMode])
  const templateSectionCount = useMemo(() => getModeSectionCount(editorMode), [editorMode])
  const decorations = useMemo(() => Object.values(decorationPresets), [])

  useEffect(() => {
    if (!isDesignModalOpen) return

    setActiveTag('all')

    setSelectedTemplatesId((prev) => prev ?? currentTemplateId)
    setSelectedThemeId((prev) => prev ?? currentTheme)
    setSelectedDecorationPresetId((prev) => prev ?? themeToPreset[currentTheme] ?? null)
  }, [isDesignModalOpen, currentTemplateId, currentTheme])

  const itemsForSection = useMemo(() => {
    if (designModalSection === 'templates') return templates
    if (designModalSection === 'themes') return themes
    return decorations
  }, [designModalSection, templates, decorations])

  const sectionTitle = useMemo(() => {
    switch (designModalSection) {
      case 'templates':
        return 'Templates'
      case 'themes':
        return 'Themes'
      case 'decorations':
        return 'Decorations'
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
    closeDesignModal()
  }

  const onSectionChange = (section: DesignCatalogSection) => {
    setDesignModalSection(section)
    setActiveTag('all')
  }

  const applySelected = () => {
    if (designModalSection === 'templates') {
      if (!selectedTemplatesId) return
      setTemplate(selectedTemplatesId as TemplateId)
      handleClose()
      return
    }

    if (designModalSection === 'themes') {
      if (!selectedThemeId) return
      setTheme(selectedThemeId as Theme)
      handleClose()
      return
    }

    if (designModalSection === 'decorations') {
      if (!selectedDecorationPresetId) return
      const preset = getDecorationById(selectedDecorationPresetId) as any

      const coerceImageUrl = (value: unknown) => {
        if (typeof value === 'string') return value
        if (value && typeof value === 'object' && 'url' in value && typeof (value as any).url === 'string') {
          return (value as any).url
        }
        return ''
      }

      const mapped = (preset.elements || []).map((el: any, i: number) => ({
        id: `preset-${selectedDecorationPresetId}-${i}-${Date.now()}`,
        position: el.position || {},
        image: coerceImageUrl(el.image) || '/placeholder.svg',
        opacity: el.opacity ?? 0.15,
        size: el.size,
        zIndex: el.zIndex || 0,
      }))

      setDecorations(mapped)

      if (preset.backgroundImage) {
        updateThemeCustomization({
          customBackground: preset.backgroundImage.url,
          backgroundImageOpacity: preset.backgroundImage.opacity,
          backgroundImageType: preset.backgroundImage.type,
        })
      }

      handleClose()
    }
  }

  const isApplyDisabled =
    (designModalSection === 'templates' && !selectedTemplatesId) ||
    (designModalSection === 'themes' && !selectedThemeId) ||
    (designModalSection === 'decorations' && !selectedDecorationPresetId)

  const selectedLabel = useMemo(() => {
    if (designModalSection === 'templates') {
      if (!selectedTemplatesId) return null
      return templates.find((t) => t.id === selectedTemplatesId)?.name ?? selectedTemplatesId
    }
    if (designModalSection === 'themes') {
      if (!selectedThemeId) return null
      return themes.find((t) => t.id === selectedThemeId)?.name ?? selectedThemeId
    }
    if (designModalSection === 'decorations') {
      if (!selectedDecorationPresetId) return null
      return getDecorationName(selectedDecorationPresetId)
    }
    return null
  }, [designModalSection, selectedTemplatesId, selectedThemeId, selectedDecorationPresetId, templates])

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
              {designModalSection === 'templates' ? (
                <TemplatesSection
                  items={visibleItems as any}
                  selectedId={selectedTemplatesId}
                  onSelect={setSelectedTemplatesId}
                  sectionCount={templateSectionCount}
                />
              ) : null}

              {designModalSection === 'themes' ? (
                <ThemesSection items={visibleItems as any} selectedId={selectedThemeId} onSelect={setSelectedThemeId} />
              ) : null}

              {designModalSection === 'decorations' ? (
                <DecorationsSection
                  items={visibleItems as any}
                  selectedId={selectedDecorationPresetId}
                  onSelect={setSelectedDecorationPresetId}
                  currentTheme={currentTheme}
                />
              ) : null}
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
