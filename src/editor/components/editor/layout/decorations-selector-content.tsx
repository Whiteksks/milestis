"use client"

import { useUiStore, useThemeStore } from '@/editor/lib/store'
import { Button } from '@/components/ui/button'
import { decorationPresets, getDecorationById, themeToPreset } from '@/editor/lib/decorations'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface DecorationsSelectorContentProps {
  onClose?: () => void
}

export function DecorationsSelectorContent({ onClose }: DecorationsSelectorContentProps) {
  const {
    setPreviewDecorations,
    clearPreviewDecorations
  } = useUiStore()

  const { setDecorations, updateThemeCustomization, currentTheme } = useThemeStore()

  const presets = Object.values(decorationPresets)
  const [selected, setSelected] = useState<string | null>(null)

  const applyPreset = (presetId?: string) => {
    if (!presetId) return
    const preset = getDecorationById(presetId) as any

    const coerceImageUrl = (value: unknown) => {
      if (typeof value === 'string') return value
      if (value && typeof value === 'object' && 'url' in value && typeof (value as any).url === 'string') {
        return (value as any).url
      }
      return ''
    }

    const mapped = (preset.elements || []).map((el: any, i: number) => ({
      id: `preset-${presetId}-${i}-${Date.now()}`,
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

    clearPreviewDecorations()
    if (onClose) onClose()
  }

  return (
    <div className="space-y-4">
      {/* Выбранный пресет */}
      <div className="text-sm text-muted-foreground">
        {selected ? (
          <span>
            Selected: <span className="text-foreground font-medium">{selected}</span>
          </span>
        ) : (
          <span>No preset selected</span>
        )}
      </div>

      {/* Сетка пресетов */}
      <div className="grid grid-cols-2 gap-3">
        {presets.map((p) => {
          const firstEl = p.elements?.[0]
          const getImgUrl = (img: any) => (typeof img === 'string' ? img : img?.url)
          const thumbnail =
            (firstEl && getImgUrl(firstEl.image)) ||
            p.backgroundImage?.url ||
            '/placeholder.svg'

          const isSelected = selected === p.id

          return (
            <div
              key={p.id}
              className={cn(
                "relative group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300",
                isSelected 
                    ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2" 
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
              )}
              onMouseEnter={() => setPreviewDecorations(p)}
              onMouseLeave={() => clearPreviewDecorations()}
              onClick={() => setSelected(p.id)}
            >
              <div className="aspect-square bg-slate-50 relative">
                <img
                  src={thumbnail}
                  alt={p.name}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-medium truncate w-full tracking-wide">
                    {p.name}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        {onClose && (
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
          >
            Cancel
          </Button>
        )}
        <Button 
          disabled={!selected} 
          onClick={() => applyPreset(selected!)}
          className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 px-6 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          Apply Preset
        </Button>
      </div>
    </div>
  )
}
