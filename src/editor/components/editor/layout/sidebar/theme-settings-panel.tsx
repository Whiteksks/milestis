"use client"

import * as React from 'react'
import { useThemeSelector, useUiSelector } from '@/editor/lib/store'
import { getModeUiConfig } from '@/editor/lib/mode-ui-configs'
import { RotateCcw, Sun, Sparkles, ChevronDown } from 'lucide-react'
import { DEPTH_EFFECTS, RAYS_EFFECTS, TEXTURE_EFFECTS } from '../background-layers/registry'
import type { DepthEffect, RayEffect, TextureEffect, BackgroundLayersTheme, BackgroundScrollMode, PhotobookTexture, PhotobookMood } from '@/editor/lib/types'
import { MOOD_OPTIONS, TEXTURE_OPTIONS } from '@/editor/components/editor/layout/background-layers/overlays/registry'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { EffectCard } from './effect-card'
import { SegmentedControl } from './segmented-control'

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
  const { themeCustomizations, updateThemeCustomization } = useThemeSelector((state) => ({
    themeCustomizations: state.themeCustomizations,
    updateThemeCustomization: state.updateThemeCustomization,
  }))

  const editorMode = useUiSelector((state) => state.editorMode)
  const isPhotobook = editorMode === 'photobook'
  const modeConfig = getModeUiConfig(editorMode)

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
                  <span className="text-primary font-medium">{activeCount} active</span>
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
            <CollapsibleSection title="Mood" icon={Sun}>
              <EffectCard
                label="Colour Mood"
                description="Global colour grade."
                value={photobookMood}
                options={MOOD_OPTIONS}
                onChange={(v) => updateThemeCustomization({ photobookMood: v as PhotobookMood })}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Photo Overlay" icon={Sparkles}>
              <EffectCard
                label="Overlay"
                description="Photographic texture."
                value={photobookTexture}
                options={TEXTURE_OPTIONS}
                onChange={(v) => updateThemeCustomization({ photobookTexture: v as PhotobookTexture })}
              />
            </CollapsibleSection>
          </>
        ) : (
          <>
            <CollapsibleSection title="General" icon={Sun}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground/60 uppercase px-1">Theme</label>
                  <SegmentedControl
                    value={layersTheme}
                    options={[{ id: 'dark', label: 'Dark' }, { id: 'light', label: 'Light' }]}
                    onChange={(v) => updateThemeCustomization({ backgroundLayersTheme: v as BackgroundLayersTheme })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground/60 uppercase px-1">Scroll</label>
                  <SegmentedControl
                    value={scrollMode}
                    options={[{ id: 'fixed', label: 'Fixed' }, { id: 'scroll', label: 'Scroll' }]}
                    onChange={(v) => updateThemeCustomization({ backgroundScrollMode: v as BackgroundScrollMode })}
                  />
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Effects" icon={Sparkles}>
              <EffectCard
                label="Depth"
                value={depth}
                options={[{ id: 'none', label: 'None' }, ...DEPTH_EFFECTS]}
                onChange={(v) => updateThemeCustomization({ depthEffect: v as DepthEffect })}
              />
              <EffectCard
                label="Rays"
                value={rays}
                options={[{ id: 'none', label: 'None' }, ...RAYS_EFFECTS]}
                onChange={(v) => updateThemeCustomization({ raysEffect: v as RayEffect })}
              />
              <EffectCard
                label="Texture"
                value={texture}
                options={[{ id: 'none', label: 'None' }, ...TEXTURE_EFFECTS]}
                onChange={(v) => updateThemeCustomization({ textureEffect: v as TextureEffect })}
              />
            </CollapsibleSection>
          </>
        )}
      </div>
    </div>
  )
}