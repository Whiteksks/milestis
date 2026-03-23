"use client"

import { memo, createElement } from 'react'
import type { CSSProperties } from 'react'
import { Check, LayoutTemplate, Layers } from 'lucide-react'

import { cn } from '@/lib/utils'
import { themes } from '@/editor/lib/themes'
import type { BackgroundPreset } from '@/editor/lib/background-presets'
import type { DepthEffect, RayEffect, TextureEffect, PhotobookMood, PhotobookTexture } from '@/editor/lib/types'
import { DEPTH_EFFECTS, RAYS_EFFECTS, TEXTURE_EFFECTS } from '@/editor/components/editor/layout/background-layers/registry'
import type { EffectColors } from '@/editor/components/editor/layout/background-layers/types'
import { PHOTOBOOK_PRESETS } from '@/editor/lib/photobook-presets'
import type { PhotobookPreset } from '@/editor/lib/photobook-presets'
import { getMoodFilter, getTextureStyle } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'

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

// Stable module-level wrappers — avoid creating components during render (react-hooks/static-components)
type EffectPreviewProps = EffectColors & { isDark: boolean; id: string }

const DepthEffectPreview = memo(function DepthEffectPreview({ id, ...rest }: EffectPreviewProps) {
  const Comp = DEPTH_MAP.get(id as DepthEffect)
  return Comp ? createElement(Comp, rest) : null
})

const RaysEffectPreview = memo(function RaysEffectPreview({ id, ...rest }: EffectPreviewProps) {
  const Comp = RAYS_MAP.get(id as RayEffect)
  return Comp ? createElement(Comp, rest) : null
})

const TextureEffectPreview = memo(function TextureEffectPreview({ id, ...rest }: EffectPreviewProps) {
  const Comp = TEXTURE_MAP.get(id as TextureEffect)
  return Comp ? createElement(Comp, rest) : null
})

function BackgroundPreviewMiniInner({ preset }: { preset: BackgroundPreset }) {
  const hasAny = DEPTH_MAP.has(preset.depth) || RAYS_MAP.has(preset.rays) || TEXTURE_MAP.has(preset.texture)

  return (
    <div className="absolute inset-0 bg-zinc-900 overflow-hidden">
      {hasAny ? (
        // Scale a 4× larger inner surface down so vw-based effects fill the card
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: '400%', height: '400%', transform: 'scale(0.25)' }}
        >
          <div className="relative w-full h-full">
            <DepthEffectPreview   id={preset.depth}   {...PREVIEW_COLORS} isDark={preset.theme === 'dark'} />
            <RaysEffectPreview    id={preset.rays}    {...PREVIEW_COLORS} isDark={preset.theme === 'dark'} />
            <TextureEffectPreview id={preset.texture} {...PREVIEW_COLORS} isDark={preset.theme === 'dark'} />
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

// ─── Photobook Mood & Texture section ─────────────────────────────────────

// ─── Photobook Preset cards ────────────────────────────────────────────────

/**
 * Warm-toned landscape gradient used as the base "photo" for all
 * preset preview thumbnails so that mood filters and texture overlays
 * are clearly visible at card size.
 */
const PHOTO_BASE =
  'linear-gradient(135deg, #c8a97e 0%, #9c7e60 25%, #7d9aad 55%, #a7b89c 80%, #d4c2a0 100%)'

function PhotobookPresetCardInner({
  preset,
  isSelected,
  onSelect,
}: {
  preset: PhotobookPreset
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const filter =
    preset.mood !== 'none' ? getMoodFilter(preset.mood as PhotobookMood) : undefined
  const raw =
    preset.texture !== 'none' ? getTextureStyle(preset.texture as PhotobookTexture) : null
  const overlayStyle: CSSProperties | undefined = raw
    ? { ...raw, backgroundAttachment: 'scroll' }
    : undefined

  const moodLabel = preset.mood !== 'none' ? preset.mood : null
  const textureLabel = preset.texture !== 'none' ? preset.texture : null

  return (
    <button
      type="button"
      onClick={() => onSelect(preset.id)}
      className={cn(
        'group relative overflow-hidden rounded-xl border text-left transition-colors duration-150 bg-card',
        isSelected
          ? 'border-primary ring-1 ring-primary'
          : 'border-border hover:border-muted-foreground/40',
      )}
    >
      {/* Visual preview */}
      <div className="relative aspect-4/3 overflow-hidden rounded-t-xl">
        {preset.mood === 'none' && preset.texture === 'none' ? (
          <div className="absolute inset-0 bg-muted/60 flex items-center justify-center">
            <span className="text-xs text-muted-foreground/50 font-medium tracking-widest uppercase">
              Clean
            </span>
          </div>
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: PHOTO_BASE, filter }} />
            {overlayStyle && <div className="absolute inset-0" style={overlayStyle} />}
          </>
        )}
        {isSelected && (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-semibold text-card-foreground leading-tight">
          {preset.name}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
          {preset.description}
        </p>
        {(moodLabel || textureLabel) && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {moodLabel && (
              <span className="text-[10px] font-medium bg-primary/8 text-primary/70 border border-primary/15 px-1.5 py-0.5 rounded-full capitalize">
                {moodLabel}
              </span>
            )}
            {textureLabel && (
              <span className="text-[10px] font-medium bg-secondary/60 text-muted-foreground border border-border/60 px-1.5 py-0.5 rounded-full capitalize">
                {textureLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}
const PhotobookPresetCard = memo(PhotobookPresetCardInner)

export function PhotobookPresetsSection({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {PHOTOBOOK_PRESETS.map((preset) => (
        <PhotobookPresetCard
          key={preset.id}
          preset={preset}
          isSelected={selectedId === preset.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

