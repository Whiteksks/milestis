"use client"

import type { ComponentType } from 'react'
import type { EditorMode } from '@/editor/lib/types'
import { useThemeSelector, useUiSelector } from '@/editor/lib/store'
import { DEPTH_EFFECTS, RAYS_EFFECTS, TEXTURE_EFFECTS } from '../background-layers/registry'
import { MOOD_OPTIONS, TEXTURE_OPTIONS } from '../background-layers/overlays/registry'
import type { DepthEffect, RayEffect, TextureEffect, BackgroundLayersTheme, BackgroundScrollMode, PhotobookMood, PhotobookTexture } from '@/editor/lib/types'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Moon, Sun, RotateCcw } from 'lucide-react'
import { EffectCard } from '../sidebar/effect-card'

// ─── Shared styles ────────────────────────────────────────────────────────────

const ICON_BTN =
  'h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0'

// ─── Component registry ───────────────────────────────────────────────────────
//
// To add a new editor mode: create its toolbar component below, then register
// it here. ThemeFloatingToolbar stays free of if/else forever.

const TOOLBAR_REGISTRY: Record<EditorMode, ComponentType> = {
  portfolio: PortfolioFloatingToolbar,
  photobook: PhotobookFloatingToolbar,
}

export function ThemeFloatingToolbar() {
  const editorMode = useUiSelector((s) => s.editorMode)
  const Toolbar = TOOLBAR_REGISTRY[editorMode]
  return <Toolbar />
}

// ─── Portfolio toolbar ────────────────────────────────────────────────────────

function PortfolioFloatingToolbar() {
  const { themeCustomizations, updateThemeCustomization } = useThemeSelector((s) => ({
    themeCustomizations: s.themeCustomizations,
    updateThemeCustomization: s.updateThemeCustomization,
  }))

  const {
    depthEffect: depth = 'none',
    raysEffect: rays = 'none',
    textureEffect: texture = 'none',
    backgroundLayersTheme: layersTheme = 'dark',
    backgroundScrollMode: scrollMode = 'fixed',
  } = themeCustomizations

  const isDark = layersTheme === 'dark'
  const isFixed = scrollMode === 'fixed'

  const handleReset = () =>
    updateThemeCustomization({
      depthEffect: 'none',
      raysEffect: 'none',
      textureEffect: 'none',
      backgroundLayersTheme: 'dark',
      backgroundScrollMode: 'fixed',
    })

  return (
    <div className="h-10 px-1 flex items-center gap-0">

      {/* Dark / light background theme */}
      <Button
        type="button"
        variant="ghost"
        title={isDark ? 'Switch to light background' : 'Switch to dark background'}
        className={cn(ICON_BTN)}
        onClick={() =>
          updateThemeCustomization({
            backgroundLayersTheme: (isDark ? 'light' : 'dark') as BackgroundLayersTheme,
          })
        }
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </Button>

      {/* Fixed / scroll mode */}
      <Button
        type="button"
        variant="ghost"
        title={isFixed ? 'Switch to parallax scroll' : 'Switch to fixed background'}
        className={cn(
          'h-7 px-2 rounded-full text-xs font-medium transition-colors shrink-0',
          !isFixed
            ? 'text-foreground hover:bg-muted/80'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
        )}
        onClick={() =>
          updateThemeCustomization({
            backgroundScrollMode: (isFixed ? 'scroll' : 'fixed') as BackgroundScrollMode,
          })
        }
      >
        {isFixed ? 'Fixed' : 'Scroll'}
      </Button>

      <Separator orientation="vertical" className="mx-1 h-4 bg-border/60 shrink-0" />

      {/* Depth effect */}
      <EffectPopover
        label="Depth"
        value={depth}
        options={[{ id: 'none', label: 'None' }, ...DEPTH_EFFECTS]}
        onChange={(v) => updateThemeCustomization({ depthEffect: v as DepthEffect })}
      />

      {/* Rays effect */}
      <EffectPopover
        label="Rays"
        value={rays}
        options={[{ id: 'none', label: 'None' }, ...RAYS_EFFECTS]}
        onChange={(v) => updateThemeCustomization({ raysEffect: v as RayEffect })}
      />

      {/* Texture effect */}
      <EffectPopover
        label="Texture"
        value={texture}
        options={[{ id: 'none', label: 'None' }, ...TEXTURE_EFFECTS]}
        onChange={(v) => updateThemeCustomization({ textureEffect: v as TextureEffect })}
      />

      {/* Reset */}
      <Separator orientation="vertical" className="mx-1 h-4 bg-border/60 shrink-0" />
      <Button
        type="button"
        variant="ghost"
        title="Reset all effects"
        disabled={depth === 'none' && rays === 'none' && texture === 'none'}
        className={cn(ICON_BTN, 'disabled:opacity-30')}
        onClick={handleReset}
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

// ─── Photobook toolbar ────────────────────────────────────────────────────────

function PhotobookFloatingToolbar() {
  const { themeCustomizations, updateThemeCustomization } = useThemeSelector((s) => ({
    themeCustomizations: s.themeCustomizations,
    updateThemeCustomization: s.updateThemeCustomization,
  }))

  const mood = themeCustomizations.photobookMood ?? 'none'
  const texture = themeCustomizations.photobookTexture ?? 'none'

  const handleReset = () =>
    updateThemeCustomization({ photobookMood: 'none', photobookTexture: 'none' })

  return (
    <div className="h-10 px-1 flex items-center gap-0">

      {/* Colour mood — MOOD_OPTIONS already includes {id:'none'} as first item */}
      <EffectPopover
        label="Mood"
        value={mood}
        options={MOOD_OPTIONS}
        onChange={(v) => updateThemeCustomization({ photobookMood: v as PhotobookMood })}
      />

      {/* Photo overlay — TEXTURE_OPTIONS already includes {id:'none'} as first item */}
      <EffectPopover
        label="Overlay"
        value={texture}
        options={TEXTURE_OPTIONS}
        onChange={(v) => updateThemeCustomization({ photobookTexture: v as PhotobookTexture })}
      />

      {/* Reset */}
      <Separator orientation="vertical" className="mx-1 h-4 bg-border/60 shrink-0" />
      <Button
        type="button"
        variant="ghost"
        title="Reset all overlays"
        disabled={mood === 'none' && texture === 'none'}
        className={cn(ICON_BTN, 'disabled:opacity-30')}
        onClick={handleReset}
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

// ─── EffectPopover ─────────────────────────────────────────────────────────────

interface EffectPopoverProps {
  label: string
  value: string
  options: { id: string; label: string }[]
  onChange: (v: string) => void
}

function EffectPopover({ label, value, options, onChange }: EffectPopoverProps) {
  const isActive = value !== 'none'
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          title={label}
          className={cn(
            'h-7 px-2.5 rounded-full text-xs font-medium transition-colors shrink-0',
            isActive
              ? 'text-primary hover:bg-primary/15 hover:text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
          )}
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={8}
        align="center"
        className="w-auto min-w-[200px] p-4 rounded-2xl border-border/60 shadow-lg m-2"
      >
        <EffectCard
          label={label}
          value={value}
          columns={3}
          options={options}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  )
}
