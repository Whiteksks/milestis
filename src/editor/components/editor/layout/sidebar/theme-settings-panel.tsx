"use client"

import * as React from 'react'
import { useThemeSelector } from '@/editor/lib/store'
import { 
  RotateCcw, Sun, Layers, Sparkles, ChevronDown
} from 'lucide-react'
import { DEPTH_EFFECTS, RAYS_EFFECTS, TEXTURE_EFFECTS } from '../background-layers/registry'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { EffectCard } from './example/effect-card'
import { SegmentedControl } from './example/segmented-control'

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
        className="flex items-center gap-2.5 w-full h-auto px-5 py-3.5 justify-start rounded-none text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 hover:text-foreground/80 hover:bg-transparent"
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 ml-auto transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 pb-5 space-y-5">
          {children}
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

  const {
    depthEffect: depth = 'none',
    raysEffect: rays = 'none',
    textureEffect: texture = 'none',
    backgroundLayersTheme: layersTheme = 'dark',
    backgroundScrollMode: scrollMode = 'fixed'
  } = themeCustomizations

  const activeCount = [depth, rays, texture].filter(v => v !== 'none').length

  const handleReset = () => {
    updateThemeCustomization({
      depthEffect: 'none',
      raysEffect: 'none',
      textureEffect: 'none',
      backgroundLayersTheme: 'dark',
      backgroundScrollMode: 'fixed',
    })
  }

  return (
    <div className="h-full flex flex-col bg-card/40 backdrop-blur-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xs bg-primary/10 border border-primary/20">
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight">Background</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {activeCount > 0 ? (
                  <span className="text-primary">{activeCount} effect{activeCount > 1 ? 's' : ''} active</span>
                ) : (
                  'No effects applied'
                )}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            disabled={activeCount === 0}
            title="Reset all settings"
            className="h-8 w-8 rounded-xs text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/40 mx-5" />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">

        {/* General Settings */}
        <CollapsibleSection title="General" icon={Sun}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-muted-foreground px-1">Theme</label>
              <SegmentedControl
                value={layersTheme}
                options={[
                  { id: 'dark', label: 'Dark' },
                  { id: 'light', label: 'Light' },
                ]}
                onChange={(v) => updateThemeCustomization({ backgroundLayersTheme: v as any })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-muted-foreground px-1">Scroll</label>
              <SegmentedControl
                value={scrollMode}
                options={[
                  { id: 'fixed', label: 'Fixed' },
                  { id: 'scroll', label: 'Scroll' },
                ]}
                onChange={(v) => updateThemeCustomization({ backgroundScrollMode: v as any })}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Effects */}
        <CollapsibleSection title="Effects" icon={Sparkles}>
          <EffectCard
            label="Depth"
            description='Adds subtle 3D layering and shadow depth.'
            value={depth}
            options={[{ id: 'none', label: 'None' }, ...DEPTH_EFFECTS]}
            onChange={(v) => updateThemeCustomization({ depthEffect: v as any })}
          />

          <div className="h-px bg-border/20" />

          <EffectCard
            label="Rays"
            description='Adds light beams and glow effects.'
            value={rays}
            options={[{ id: 'none', label: 'None' }, ...RAYS_EFFECTS]}
            onChange={(v) => updateThemeCustomization({ raysEffect: v as any })}
          />

          <div className="h-px bg-border/20" />

          <EffectCard
            label="Texture"
            description='Adds surface textures.'
            value={texture}
            options={[{ id: 'none', label: 'None' }, ...TEXTURE_EFFECTS]}
            onChange={(v) => updateThemeCustomization({ textureEffect: v as any })}
          />
        </CollapsibleSection>
      </div>

    </div>
  )
}