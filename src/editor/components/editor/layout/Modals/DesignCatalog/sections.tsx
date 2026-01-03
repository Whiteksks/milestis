"use client"

import Image from 'next/image'
import { Check, LayoutTemplate } from 'lucide-react'

import { cn } from '@/lib/utils'
import { themes } from '@/editor/lib/themes'
import { decorationPresets, themeToPreset } from '@/editor/lib/decorations'
import type { Theme } from '@/editor/lib/types'

type Templates = Array<{ id: string; name: string }>

type Decorations = Array<{
  id: string
  name?: string
  description?: string
  tags?: string[]
  elements?: any[]
  backgroundImage?: { url: string }
}>

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
              'group relative overflow-hidden rounded-xl border text-left transition-all duration-200 bg-card',
              isSelected
                ? 'border-primary ring-1 ring-primary'
                : 'border-border hover:border-muted-foreground/40'
            )}
          >
            <div className="relative aspect-4/3 bg-muted overflow-hidden flex items-center justify-center">
              <LayoutTemplate className="h-10 w-10 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
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
              'group relative overflow-hidden rounded-xl border text-left transition-all duration-200 bg-card',
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

export function DecorationsSection({
  items,
  selectedId,
  onSelect,
  currentTheme,
}: {
  items: Decorations
  selectedId: string | null
  onSelect: (id: string) => void
  currentTheme: Theme
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <LayoutTemplate className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-foreground font-medium">No presets found</p>
        <p className="text-sm text-muted-foreground mt-1">Try a different tag</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {items.map((p) => {
        const firstEl = p.elements?.[0]
        const getImgUrl = (img: any) => (typeof img === 'string' ? img : img?.url)
        const thumbnail = (firstEl && getImgUrl(firstEl.image)) || p.backgroundImage?.url || '/placeholder.svg'

        const isSelected = selectedId === p.id

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className={cn(
              'group relative overflow-hidden rounded-xl border text-left transition-all duration-200 bg-card',
              isSelected
                ? 'border-primary ring-1 ring-primary'
                : 'border-border hover:border-muted-foreground/40'
            )}
          >
            <div className="relative aspect-4/3 bg-muted overflow-hidden">
              <Image
                src={thumbnail}
                alt={p.name ?? 'Decoration preset'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {isSelected ? (
                <div className="absolute top-2 right-2 z-10">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                </div>
              ) : null}

              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3">
                <span className="text-xs font-medium text-foreground text-center line-clamp-2">
                  {p.description ??
                    (themeToPreset[currentTheme] === p.id
                      ? 'Matches your current theme preset'
                      : 'Works with most themes')}
                </span>
              </div>
            </div>

            <div className="p-3">
              <h3 className="text-sm font-medium text-card-foreground truncate">{p.name ?? p.id}</h3>
              <p className="text-xs text-muted-foreground mt-1 truncate">{p.description ?? p.id}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export function getDecorationName(id: string): string {
  return decorationPresets[id]?.name ?? id
}
