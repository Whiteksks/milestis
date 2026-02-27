"use client"

import { useThemeSelector } from '@/editor/lib/store'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DepthEffect, RayEffect, TextureEffect, BackgroundLayersTheme, BackgroundScrollMode } from '@/editor/lib/types'

const DEPTH_OPTIONS: { id: DepthEffect; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'radial-glow', label: 'Glow' },
  { id: 'vignette', label: 'Vignette' },
  { id: 'ambient-blobs', label: 'Blobs' },
  { id: 'asymmetric-light', label: 'Asymmetric' },
]

const RAYS_OPTIONS: { id: RayEffect; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'diagonal-rays', label: 'Diagonal' },
  { id: 'conic-rays', label: 'Conic' },
  { id: 'soft-streaks', label: 'Streaks' },
]

const TEXTURE_OPTIONS: { id: TextureEffect; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'grain', label: 'Grain' },
  { id: 'dots', label: 'Dots' },
  { id: 'lines', label: 'Lines' },
  { id: 'grid', label: 'Grid' },
]

function OptionRow<T extends string>({
  label,
  hint,
  options,
  active,
  onChange,
}: {
  label: string
  hint?: string
  options: { id: T; label: string }[]
  active: T
  onChange: (v: T) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-foreground/50">
          {label}
        </span>
        {hint && (
          <span className="text-[10px] text-muted-foreground/40">{hint}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              'px-3 py-1.5 text-[11px] font-medium tracking-wide rounded-lg transition-all duration-150',
              active === opt.id
                ? 'bg-foreground/12 text-foreground border border-foreground/20 shadow-sm'
                : 'text-foreground/45 hover:text-foreground/70 border border-transparent hover:border-border/40'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ThemeSettingsPanel() {
  const { themeCustomizations, updateThemeCustomization } = useThemeSelector((state) => ({
    themeCustomizations: state.themeCustomizations,
    updateThemeCustomization: state.updateThemeCustomization,
  }))

  const depth = themeCustomizations.depthEffect ?? 'none'
  const rays = themeCustomizations.raysEffect ?? 'none'
  const texture = themeCustomizations.textureEffect ?? 'none'
  const layersTheme = themeCustomizations.backgroundLayersTheme ?? 'dark'
  const scrollMode = themeCustomizations.backgroundScrollMode ?? 'fixed'

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
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-border/60">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground">Background</h3>
          <p className="text-xs text-muted-foreground">Layer system</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 px-3 text-xs rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex gap-2"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>

      <div className="px-6 pt-5 pb-6 space-y-5 overflow-y-auto">

        {/* Dark / Light + Fixed / Scroll toggles */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-foreground/50">
            Mode
          </span>
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            {(['dark', 'light'] as BackgroundLayersTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => updateThemeCustomization({ backgroundLayersTheme: t })}
                className={cn(
                  'px-3 py-1.5 text-[11px] font-medium tracking-wide transition-all duration-150 capitalize',
                  layersTheme === t
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-foreground/40 hover:text-foreground/60 hover:bg-muted/40'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Fixed / Scroll scroll-mode toggle */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-foreground/50">
            Scroll
          </span>
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            {(['fixed', 'scroll'] as BackgroundScrollMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => updateThemeCustomization({ backgroundScrollMode: m })}
                className={cn(
                  'px-3 py-1.5 text-[11px] font-medium tracking-wide transition-all duration-150 capitalize',
                  scrollMode === m
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-foreground/40 hover:text-foreground/60 hover:bg-muted/40'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/30" />

        {/* Layer 1 label */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-muted/80 border border-border/50 flex items-center justify-center">
            <span className="text-[9px] font-bold text-muted-foreground">1</span>
          </div>
          <span className="text-xs text-foreground/60">Base — solid <code className="text-[10px] bg-muted/60 px-1 rounded">--background</code> from theme</span>
        </div>

        <div className="h-px bg-border/30" />

        {/* Layer 2: Depth */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-md bg-muted/80 border border-border/50 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[9px] font-bold text-muted-foreground">2</span>
          </div>
          <OptionRow
            label="Depth"
            hint="gradient & glow"
            options={DEPTH_OPTIONS}
            active={depth}
            onChange={(v) => updateThemeCustomization({ depthEffect: v })}
          />
        </div>

        <div className="h-px bg-border/30" />

        {/* Layer 2b: Rays */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-md bg-muted/80 border border-border/50 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[9px] font-bold text-muted-foreground">2</span>
          </div>
          <OptionRow
            label="Rays"
            hint="light streaks"
            options={RAYS_OPTIONS}
            active={rays}
            onChange={(v) => updateThemeCustomization({ raysEffect: v })}
          />
        </div>

        <div className="h-px bg-border/30" />

        {/* Layer 3: Texture */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-md bg-muted/80 border border-border/50 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[9px] font-bold text-muted-foreground">3</span>
          </div>
          <OptionRow
            label="Texture"
            hint="overlay pattern"
            options={TEXTURE_OPTIONS}
            active={texture}
            onChange={(v) => updateThemeCustomization({ textureEffect: v })}
          />
        </div>

      </div>
    </div>
  )
}