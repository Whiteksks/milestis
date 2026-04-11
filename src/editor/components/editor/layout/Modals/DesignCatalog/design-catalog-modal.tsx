"use client"

import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import { useThemeSelector, useUiSelector, type ThemeCustomizations } from '@/editor/lib/store'
import { themes } from '@/editor/lib/themes'
import { BACKGROUND_PRESETS } from '@/editor/lib/background-presets'
import type { BackgroundPreset } from '@/editor/lib/background-presets'
import { getModeTemplates } from '@/editor/lib/mode-registry'
import { getModeUiConfig } from '@/editor/lib/mode-ui-configs'
import { PHOTOBOOK_PRESETS, findMatchingPreset } from '@/editor/lib/photobook-presets'
import type { TemplateId, Theme, PhotobookMood, PhotobookTexture } from '@/editor/lib/types'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { ChevronRight, Eye, EyeOff, Filter, LayoutTemplate, Palette } from 'lucide-react'

import type { DesignCatalogSection } from './types'
import { DesignCatalogSidebar } from './design-catalog-sidebar'
import { DesignCatalogFooter } from './design-catalog-footer'
import { BackgroundsSection, PhotobookPresetsSection, ThemesSection, TemplatesSection } from './sections'

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
    themeCustomizations,
    setTheme,
    setTemplate,
    updateThemeCustomization,
  } = useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
    currentTemplateId: state.currentTemplateId,
    themeCustomizations: state.themeCustomizations,
    setTheme: state.setTheme,
    setTemplate: state.setTemplate,
    updateThemeCustomization: state.updateThemeCustomization,
  }))

  const [activeTag, setActiveTag] = useState<string>('all')
  const [selectedTemplatesId, setSelectedTemplatesId] = useState<string | null>(null)
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string | null>(null)
  const [selectedPhotobookPresetId, setSelectedPhotobookPresetId] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const originalRef = useRef<{
    templateId: TemplateId
    theme: Theme
    customizations: ThemeCustomizations
  } | null>(null)

  const templates = useMemo(() => getModeTemplates(editorMode), [editorMode])
  const isPhotobook = editorMode === 'photobook'
  const modeConfig = getModeUiConfig(editorMode)

  useEffect(() => {
    if (isDesignModalOpen) {
      originalRef.current = {
        templateId: currentTemplateId,
        theme: currentTheme,
        customizations: { ...themeCustomizations },
      }
      setIsPreviewMode(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesignModalOpen])

  const effectiveSelectedTemplatesId = selectedTemplatesId ?? currentTemplateId ?? null
  const effectiveSelectedThemeId = selectedThemeId ?? currentTheme ?? null
  const currentBackgroundPresetId = useMemo(
    () =>
      BACKGROUND_PRESETS.find(
        (p) =>
          p.depth === themeCustomizations?.depthEffect &&
          p.rays === themeCustomizations?.raysEffect &&
          p.texture === themeCustomizations?.textureEffect,
      )?.id ?? null,
    [themeCustomizations],
  )
  const effectiveSelectedBackgroundId = selectedBackgroundId ?? currentBackgroundPresetId

  const currentPhotobookPresetId = useMemo(
    () =>
      findMatchingPreset(
        themeCustomizations?.photobookMood ?? 'none',
        themeCustomizations?.photobookTexture ?? 'none',
      )?.id ?? null,
    [themeCustomizations],
  )
  const effectivePhotobookPresetId = selectedPhotobookPresetId ?? currentPhotobookPresetId

  const itemsForSection = useMemo(() => {
    if (designModalSection === 'templates') return templates
    if (designModalSection === 'themes') return themes
    if (isPhotobook) return []
    return BACKGROUND_PRESETS
  }, [designModalSection, templates, isPhotobook])

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

  const currentTemplateName = useMemo(
    () => templates.find((t) => t.id === currentTemplateId)?.name ?? currentTemplateId ?? null,
    [templates, currentTemplateId]
  )
  const currentThemeName = useMemo(
    () => themes.find((t) => t.id === currentTheme)?.name ?? currentTheme ?? null,
    [currentTheme]
  )
  const currentBackgroundName = useMemo(
    () => BACKGROUND_PRESETS.find((p) => p.id === currentBackgroundPresetId)?.name ?? null,
    [currentBackgroundPresetId],
  )

  const revertAll = () => {
    if (!originalRef.current) return
    setTemplate(originalRef.current.templateId)
    setTheme(originalRef.current.theme)
    updateThemeCustomization(originalRef.current.customizations)
  }

  const closeModal = () => {
    clearPreviewDecorations()
    setActiveTag('all')
    setIsPreviewMode(false)
    setSelectedTemplatesId(null)
    setSelectedThemeId(null)
    setSelectedBackgroundId(null)
    setSelectedPhotobookPresetId(null)
    closeDesignModal()
  }

  const handleClose = () => {
    if (isPreviewMode) revertAll()
    closeModal()
  }

  const onSectionChange = (section: DesignCatalogSection) => {
    setDesignModalSection(section)
    setActiveTag('all')
  }

  const togglePreviewMode = () => {
    const next = !isPreviewMode
    setIsPreviewMode(next)
    if (next) {
      if (designModalSection === 'templates' && effectiveSelectedTemplatesId) {
        setTemplate(effectiveSelectedTemplatesId as TemplateId)
      } else if (designModalSection === 'themes' && effectiveSelectedThemeId) {
        setTheme(effectiveSelectedThemeId as Theme)
      } else if (designModalSection === 'backgrounds') {
        if (isPhotobook) {
          const preset = PHOTOBOOK_PRESETS.find((p) => p.id === effectivePhotobookPresetId)
          if (preset) {
            updateThemeCustomization({
              photobookMood: preset.mood as PhotobookMood,
              photobookTexture: preset.texture as PhotobookTexture,
            })
          }
        } else if (effectiveSelectedBackgroundId) {
          const preset = BACKGROUND_PRESETS.find((p) => p.id === effectiveSelectedBackgroundId)
          if (preset) {
            updateThemeCustomization({
              depthEffect: preset.depth,
              raysEffect: preset.rays,
              textureEffect: preset.texture,
              backgroundLayersTheme: preset.theme,
            })
          }
        }
      }
    } else {
      revertAll()
    }
  }

  const applySelected = () => {
    if (!isPreviewMode) {
      if (selectedTemplatesId) setTemplate(selectedTemplatesId as TemplateId)
      if (selectedThemeId) setTheme(selectedThemeId as Theme)
      if (isPhotobook) {
        if (selectedPhotobookPresetId) {
          const preset = PHOTOBOOK_PRESETS.find((p) => p.id === selectedPhotobookPresetId)
          if (preset) {
            updateThemeCustomization({
              photobookMood: preset.mood as PhotobookMood,
              photobookTexture: preset.texture as PhotobookTexture,
            })
          }
        }
      } else if (selectedBackgroundId) {
        const preset = BACKGROUND_PRESETS.find((p) => p.id === selectedBackgroundId)
        if (preset) {
          updateThemeCustomization({
            depthEffect: preset.depth,
            raysEffect: preset.rays,
            textureEffect: preset.texture,
            backgroundLayersTheme: preset.theme,
          })
        }
      }
    }
    closeModal()
  }

  const isApplyDisabled = !selectedTemplatesId && !selectedThemeId && !selectedBackgroundId && !selectedPhotobookPresetId

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
      if (isPhotobook) {
        const preset = PHOTOBOOK_PRESETS.find((p) => p.id === effectivePhotobookPresetId)
        return preset ? preset.name : null
      }
      if (!effectiveSelectedBackgroundId) return null
      return BACKGROUND_PRESETS.find((p) => p.id === effectiveSelectedBackgroundId)?.name ?? effectiveSelectedBackgroundId
    }
    return null
  }, [
    designModalSection,
    isPhotobook,
    effectiveSelectedTemplatesId,
    effectiveSelectedThemeId,
    effectiveSelectedBackgroundId,
    effectivePhotobookPresetId,
    templates,
  ])

  const isMobile = useIsMobile()

  const sectionContent = useMemo(() => {
    const onTemplateSelect = (id: string) => {
      setSelectedTemplatesId(id)
      if (isPreviewMode) setTemplate(id as TemplateId)
    }
    const onThemeSelect = (id: string) => {
      setSelectedThemeId(id)
      if (isPreviewMode) setTheme(id as Theme)
    }
    const onBackgroundSelect = (id: string) => {
      setSelectedBackgroundId(id)
      if (isPreviewMode) {
        const preset = BACKGROUND_PRESETS.find((p) => p.id === id)
        if (preset) {
          updateThemeCustomization({
            depthEffect: preset.depth,
            raysEffect: preset.rays,
            textureEffect: preset.texture,
            backgroundLayersTheme: preset.theme,
          })
        }
      }
    }
    const onPresetSelect = (id: string) => {
      setSelectedPhotobookPresetId(id)
      if (isPreviewMode) {
        const preset = PHOTOBOOK_PRESETS.find((p) => p.id === id)
        if (preset) {
          updateThemeCustomization({
            photobookMood: preset.mood as PhotobookMood,
            photobookTexture: preset.texture as PhotobookTexture,
          })
        }
      }
    }
    return (
      <>
        {designModalSection === 'templates' && (
          <TemplatesSection
            items={visibleItems as typeof templates}
            selectedId={effectiveSelectedTemplatesId}
            onSelect={onTemplateSelect}
            themeId={effectiveSelectedThemeId ?? currentTheme ?? undefined}
          />
        )}
        {designModalSection === 'themes' && (
          <ThemesSection
            items={visibleItems as typeof themes}
            selectedId={effectiveSelectedThemeId}
            onSelect={onThemeSelect}
          />
        )}
        {designModalSection === 'backgrounds' && isPhotobook && (
          <PhotobookPresetsSection
            selectedId={effectivePhotobookPresetId}
            onSelect={onPresetSelect}
          />
        )}
        {designModalSection === 'backgrounds' && !isPhotobook && (
          <BackgroundsSection
            items={visibleItems as BackgroundPreset[]}
            selectedId={effectiveSelectedBackgroundId}
            onSelect={onBackgroundSelect}
          />
        )}
      </>
    )
  }, [
    designModalSection,
    isPhotobook,
    visibleItems,
    effectiveSelectedTemplatesId,
    effectiveSelectedThemeId,
    effectiveSelectedBackgroundId,
    effectivePhotobookPresetId,
    isPreviewMode,
    setTemplate,
    setTheme,
    updateThemeCustomization,
    currentTheme,
  ])

  // ── MOBILE: Drawer ──────────────────────────────────────────────
  if (isMobile) {
    const mobileSections = [
      { id: 'templates' as const, icon: LayoutTemplate, label: 'Templates' },
      { id: 'themes' as const, icon: Palette, label: 'Themes' },
      { id: 'backgrounds' as const, icon: modeConfig.backgroundCatalogMobileIcon, label: modeConfig.backgroundCatalogMobileLabel },
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
        <DrawerContent className={cn("md:hidden flex flex-col bg-card border-border/60 focus:outline-none transition-opacity duration-200", isPreviewMode && "opacity-60")}>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Design Catalog</DrawerTitle>
            <DrawerDescription>Choose a template, theme, and background effects.</DrawerDescription>
          </DrawerHeader>

          {/* Section switcher — horizontal tabs */}
          <div className="shrink-0 px-4 pt-1 pb-0">
            <div className="flex gap-1 items-center">
              {mobileSections.map(({ id, icon: Icon, label }) => (
                <Button
                  key={id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSectionChange(id)}
                  className={cn(
                    'flex-1',
                    designModalSection === id && 'bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{label}</span>
                </Button>
              ))}
              <Button
                variant={isPreviewMode ? 'outline' : 'ghost'}
                size="sm"
                onClick={togglePreviewMode}
                className={cn('shrink-0', isPreviewMode && 'border-primary/40 text-primary hover:text-primary')}
              >
                {isPreviewMode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">Preview</span>
              </Button>
            </div>
          </div>

          {/* Tag filter — popover button */}
          {tagMeta.availableTags.length > 0 && (
            <div className="shrink-0 px-4 pt-2 pb-0 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {visibleItems.length} item{visibleItems.length !== 1 ? 's' : ''}
                {activeTag !== 'all' && (
                  <> · <span className="font-medium text-foreground">{activeTag}</span></>
                )}
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={activeTag !== 'all' ? 'outline' : 'ghost'}
                    size="sm"
                    className={cn('h-7 gap-1.5 text-xs', activeTag !== 'all' && 'border-primary/40 text-primary hover:text-primary')}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" side="bottom" className="w-44 p-1.5">
                  <Button
                    variant={activeTag === 'all' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => setActiveTag('all')}
                  >
                    All
                    <span className="text-xs text-muted-foreground">{itemsForSection.length}</span>
                  </Button>
                  {tagMeta.availableTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={activeTag === tag ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => setActiveTag(tag)}
                    >
                      <span className="truncate">{tag}</span>
                      <span className="text-xs text-muted-foreground ml-2">{tagMeta.counts.get(tag)}</span>
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Scrollable content — overscroll-contain keeps vaul drag working */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 min-h-0">
            {sectionContent}
          </div>

          {/* Sticky footer */}
          <DrawerFooter className="shrink-0 border-t border-border bg-sidebar/50 flex-row items-center justify-between gap-4 mt-0 px-4 py-4">
            <DesignCatalogFooter
              selectedLabel={selectedLabel}
              isApplyDisabled={isApplyDisabled}
              onCancel={handleClose}
              onApply={applySelected}
            />
          </DrawerFooter>
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
        className={cn(
          `max-w-5xl
          h-[82vh]
          flex flex-col
          bg-background
          border-border p-0 
          overflow-hidden
          transition-opacity duration-200`,
          isPreviewMode && 'opacity-55'
        )}
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
            editorMode={editorMode}
          />

          <main className="flex-1 flex flex-col min-h-0 min-w-0">
            <DialogHeader className="shrink-0 px-4 md:px-6 py-4 border-b border-border flex-row items-center justify-between gap-4">
              <div className="hidden md:flex items-center gap-1.5 text-xs min-w-0 flex-1 overflow-hidden">
                <span className="text-muted-foreground shrink-0">Applied:</span>
                <span className="font-medium text-foreground/80 truncate max-w-[100px]">{currentTemplateName ?? '—'}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                <span className="font-medium text-foreground/80 truncate max-w-[100px]">{currentThemeName ?? '—'}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                <span className="font-medium text-foreground/80 truncate max-w-[100px]">{currentBackgroundName ?? 'None'}</span>
              </div>
              <Button
                variant={isPreviewMode ? 'outline' : 'ghost'}
                size="sm"
                onClick={togglePreviewMode}
                className={cn('shrink-0 mr-6', isPreviewMode && 'border-primary/40 text-primary hover:text-primary')}
              >
                {isPreviewMode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                <span>Preview</span>
              </Button>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
              {sectionContent}
            </div>

            <DialogFooter className="shrink-0 px-4 md:px-6 py-4 border-t border-border bg-sidebar/50 flex-row items-center justify-between gap-4">
              <DesignCatalogFooter
                selectedLabel={selectedLabel}
                isApplyDisabled={isApplyDisabled}
                onCancel={handleClose}
                onApply={applySelected}
              />
            </DialogFooter>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DesignCatalogModal
