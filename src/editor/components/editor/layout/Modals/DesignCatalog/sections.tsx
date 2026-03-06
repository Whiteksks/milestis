"use client"

import { memo } from 'react'                        
import { Check, LayoutTemplate, Layers } from 'lucide-react'

import { cn } from '@/lib/utils'
import { themes } from '@/editor/lib/themes'
import type { BackgroundPreset } from '@/editor/lib/background-presets'
import { DEPTH_EFFECTS, RAYS_EFFECTS, TEXTURE_EFFECTS } from '@/editor/components/editor/layout/background-layers/registry'
import type { EffectColors } from '@/editor/components/editor/layout/background-layers/types'

// Module-level Maps for O(1) effect lookups — built once, never recreated
const DEPTH_MAP = new Map(DEPTH_EFFECTS.map((e) => [e.id, e.Component]))
const RAYS_MAP  = new Map(RAYS_EFFECTS.map((e) => [e.id, e.Component]))
const TEXTURE_MAP = new Map(TEXTURE_EFFECTS.map((e) => [e.id, e.Component]))

// Static color palette used in previews — a generic vibrant dark palette
const PREVIEW_COLORS: EffectColors = {
  primaryColor:   '#a855f7',
  secondaryColor: '#3b82f6',
  rayColor:       '#c4b5fd',
  subtleColor:    '#6d28d9',
  highlightColor: '#ffffff',
  shadowColor:    '#000000',
  accent2Color:   '#ec4899',
}

function BackgroundPreviewMiniInner({ preset }: { preset: BackgroundPreset }) {
  const DepthComp   = DEPTH_MAP.get(preset.depth)
  const RaysComp    = RAYS_MAP.get(preset.rays)
  const TextureComp = TEXTURE_MAP.get(preset.texture)

  const hasAny = DepthComp || RaysComp || TextureComp

  return (
    <div className="absolute inset-0 bg-zinc-900 overflow-hidden">
      {hasAny ? (
        // Scale a 4× larger inner surface down so vw-based effects fill the card
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: '400%', height: '400%', transform: 'scale(0.25)' }}
        >
          <div className="relative w-full h-full">
            {DepthComp   && <DepthComp   {...PREVIEW_COLORS} isDark={preset.theme === 'dark'} />}
            {RaysComp    && <RaysComp    {...PREVIEW_COLORS} isDark={preset.theme === 'dark'} />}
            {TextureComp && <TextureComp {...PREVIEW_COLORS} isDark={preset.theme === 'dark'} />}
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <Layers className="h-8 w-8 text-zinc-600" />
        </div>
      )}
    </div>
  )
}
const BackgroundPreviewMini = memo(BackgroundPreviewMiniInner)

type Templates = Array<{ id: string; name: string }>

export function TemplatesSection({
  items,
  selectedId,
  onSelect,
  sectionCount,
}: {
  items: Templates
  selectedId: string | null
  onSelect: (id: string) => void
  sectionCount: number
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {items.map((template) => {
        const isSelected = selectedId === template.id
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              'relative overflow-hidden rounded-xl border text-left transition-colors duration-150 bg-card',
              isSelected
                ? 'border-primary ring-1 ring-primary'
                : 'border-border hover:border-muted-foreground/40'
            )}
          >
            <div className="relative aspect-4/3 bg-muted overflow-hidden flex items-center justify-center">
              <LayoutTemplate className="h-10 w-10 text-muted-foreground" />
              {isSelected ? (
                <div className="absolute top-2 right-2 z-10">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-card-foreground truncate">{template.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 truncate">{sectionCount} sections</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export function ThemesSection({
  items,
  selectedId,
  onSelect,
}: {
  items: typeof themes
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {items.map((theme) => {
        const isSelected = selectedId === theme.id
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            className={cn(
              'group relative overflow-hidden rounded-xl border text-left transition-colors duration-150 bg-card',
              isSelected
                ? 'border-primary ring-1 ring-primary'
                : 'border-border hover:border-muted-foreground/40'
            )}
          >
            <div className={cn('relative aspect-4/3 overflow-hidden flex items-center justify-center', theme.background)}>
              <div className={cn('text-xs font-semibold tracking-wide uppercase', theme.foreground, theme.fontTitle)}>
                {theme.name}
              </div>

              <div className={cn('absolute left-3 bottom-3 h-1.5 w-10 rounded-full opacity-80', theme.primary)} />

              <div className="absolute right-3 bottom-3 flex gap-1">
                <div className={cn('w-3 h-3 rounded-full border border-black/10', theme.primary)} />
                <div className={cn('w-3 h-3 rounded-full border border-black/10', theme.accent)} />
                <div className={cn('w-3 h-3 rounded-full border border-black/10', theme.secondary)} />
              </div>

            {isSelected ? (
              <div className="absolute top-2 right-2 z-10">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              </div>
            ) : null}
          </div>

            <div className="p-3">
              <h3 className="text-sm font-medium text-card-foreground truncate">{theme.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 truncate">{theme.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export function BackgroundsSection({
  items,
  selectedId,
  onSelect,
}: {
  items: BackgroundPreset[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {items.map((preset) => {
        const isSelected = selectedId === preset.id

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            className={cn(
              'group relative overflow-hidden rounded-xl border text-left transition-colors duration-150 bg-card',
              isSelected
                ? 'border-primary ring-1 ring-primary'
                : 'border-border hover:border-muted-foreground/40'
            )}
          >
            <div className="relative aspect-4/3 overflow-hidden rounded-t-xl">
              <BackgroundPreviewMini preset={preset} />

              {isSelected ? (
                <div className="absolute top-2 right-2 z-10">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-3">
              <h3 className="text-sm font-medium text-card-foreground truncate">{preset.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 truncate">{preset.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

