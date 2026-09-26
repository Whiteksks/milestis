"use client"

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { useThemeSelector, useUiSelector } from '@/editor/lib/store'
import { getModeUiConfig } from '@/editor/lib/modes'
import { RotateCcw, Sun, Sparkles, ChevronDown } from 'lucide-react'
import type { DepthEffect, RayEffect, TextureEffect, BackgroundLayersTheme, BackgroundScrollMode, PhotobookTexture, PhotobookMood } from '@/editor/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { EffectCard } from './effect-card'
import { SegmentedControl } from './segmented-control'
import { usePhotobookThemeToolbar, usePortfolioThemeToolbar } from '@/editor/hooks/use-theme-toolbar'

interface CollapsibleSectionProps {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className="border-b border-border/40 last:border-b-0">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 w-full h-auto px-5 py-3.5 justify-start rounded-none text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-foreground hover:bg-transparent"
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 ml-auto transition-transform duration-200 ease-out",
            isOpen && "rotate-180"
          )}
        />
      </Button>
      
      {/* Оптимизированный контейнер для раскрытия */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 space-y-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ThemeSettingsPanel() {
  const t = useTranslations('editor.controls.theme')
  const translate = useTranslations()
  const {
    depthOptions,
    raysOptions,
    textureOptions,
    setDepth,
    setRays,
    setTexture,
  } = usePortfolioThemeToolbar()
  const {
    moodOptions: photobookMoodOptions,
    textureOptions: photobookTextureOptions,
    setMood,
    setTexture: setPhotobookTexture,
  } = usePhotobookThemeToolbar()
  const { themeCustomizations, updateThemeCustomization } = useThemeSelector((state) => ({
    themeCustomizations: state.themeCustomizations,
    updateThemeCustomization: state.updateThemeCustomization,
  }))

  const editorMode = useUiSelector((state) => state.editorMode)
  const isPhotobook = editorMode === 'photobook' || editorMode === 'event'
  const modeConfig = getModeUiConfig(editorMode, translate)

  const {
    depthEffect: depth = 'none',
    raysEffect: rays = 'none',
    textureEffect: texture = 'none',
    backgroundLayersTheme: layersTheme = 'dark',
    backgroundScrollMode: scrollMode = 'fixed',
    photobookTexture = 'none',
    photobookMood = 'none',
  } = themeCustomizations

  const activeCount = modeConfig.getActiveEffectsCount(themeCustomizations)

  if (editorMode === 'menu') return null

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pb-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 p-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-xs bg-primary/10 border border-primary/20">
              <modeConfig.backgroundIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                {modeConfig.backgroundLabel}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {activeCount > 0 ? (
                  <span className="text-primary font-medium">{t('activeCount', { count: activeCount })}</span>
                ) : modeConfig.backgroundHint}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => modeConfig.resetEffects(updateThemeCustomization)}
            disabled={activeCount === 0}
            className="h-8 w-8 rounded-full text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="h-px bg-border/40 mx-5" />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isPhotobook ? (
          <>
            <CollapsibleSection title={t('photobook.moodTitle')} icon={Sun}>
              <EffectCard
                label={t('photobook.moodLabel')}
                description={t('photobook.moodDescription')}
                value={photobookMood}
                options={photobookMoodOptions}
                onChange={(v) => setMood(v as PhotobookMood)}
              />
            </CollapsibleSection>

            <CollapsibleSection title={t('photobook.overlayTitle')} icon={Sparkles}>
              <EffectCard
                label={t('photobook.overlayLabel')}
                description={t('photobook.overlayDescription')}
                value={photobookTexture}
                options={photobookTextureOptions}
                onChange={(v) => setPhotobookTexture(v as PhotobookTexture)}
              />
            </CollapsibleSection>
          </>
        ) : (
          <>
            <CollapsibleSection title={t('portfolio.generalTitle')} icon={Sun}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground/60 uppercase px-1">{t('portfolio.themeLabel')}</label>
                  <SegmentedControl
                    value={layersTheme}
                    options={[{ id: 'dark', label: t('dark') }, { id: 'light', label: t('light') }]}
                    onChange={(v) => updateThemeCustomization({ backgroundLayersTheme: v as BackgroundLayersTheme })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground/60 uppercase px-1">{t('portfolio.scrollLabel')}</label>
                  <SegmentedControl
                    value={scrollMode}
                    options={[{ id: 'fixed', label: t('fixed') }, { id: 'scroll', label: t('scroll') }]}
                    onChange={(v) => updateThemeCustomization({ backgroundScrollMode: v as BackgroundScrollMode })}
                  />
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('portfolio.effectsTitle')} icon={Sparkles}>
              <EffectCard
                label={t('portfolio.depthLabel')}
                value={depth}
                options={depthOptions}
                onChange={(v) => setDepth(v as DepthEffect)}
              />
              <EffectCard
                label={t('portfolio.raysLabel')}
                value={rays}
                options={raysOptions}
                onChange={(v) => setRays(v as RayEffect)}
              />
              <EffectCard
                label={t('portfolio.textureLabel')}
                value={texture}
                options={textureOptions}
                onChange={(v) => setTexture(v as TextureEffect)}
              />
            </CollapsibleSection>
          </>
        )}
      </div>
    </div>
  )
}
