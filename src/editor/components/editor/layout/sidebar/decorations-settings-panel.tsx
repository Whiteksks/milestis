"use client"

import { useThemeSelector, useUiSelector, type ThemeCustomDecorations } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react'
import { useMemo, MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import { useCanvasScrollContainer } from '@/editor/components/editor/canvas-scroll-context'
import Image from 'next/image'
import { decorationAnimationOptions, type DecorationAnimation } from '@/editor/lib/decoration-animations'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const createDecorationId = (prefix = 'decoration') => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `${prefix}-${crypto.randomUUID()}`
    }
  } catch {
    // ignore
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

const coerceImageUrl = (value: unknown) => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'url' in value && typeof (value as Record<string, unknown>).url === 'string') {
    return (value as Record<string, unknown>).url as string
  }
  return ''
}

export function DecorationsSettingsPanel() {
  const canvasScrollRef = useCanvasScrollContainer()
  
  const {
    themeCustomizations,
    updateThemeCustomization,
    customDecorations,
    addDecoration,
    updateDecoration,
    removeDecoration,
    resetDecorations,
    setDecorations,
  } = useThemeSelector((state) => ({
    themeCustomizations: state.themeCustomizations,
    updateThemeCustomization: state.updateThemeCustomization,
    customDecorations: state.customDecorations,
    addDecoration: state.addDecoration,
    updateDecoration: state.updateDecoration,
    removeDecoration: state.removeDecoration,
    resetDecorations: state.resetDecorations,
    setDecorations: state.setDecorations,
  }))

  const { selectedDecorationId, setSelectedDecorationId } = useUiSelector((state) => ({
    selectedDecorationId: state.selectedDecorationId,
    setSelectedDecorationId: state.setSelectedDecorationId,
  }))

  const decorations = customDecorations

  const handleAddDecoration = () => {
    const scroller = canvasScrollRef?.current
    const contentRoot = scroller?.querySelector<HTMLElement>('[data-canvas-content-root="true"]')

    const position = (() => {
      if (!scroller || !contentRoot) return { top: '10%', left: '10%' }
      const scrollerRect = scroller.getBoundingClientRect()
      const contentRect = contentRoot.getBoundingClientRect()
      if (contentRect.width <= 0 || contentRect.height <= 0) return { top: '10%', left: '10%' }

      const centerClientX = scrollerRect.left + scroller.clientWidth / 2
      const centerClientY = scrollerRect.top + scroller.clientHeight / 2

      const xInContent = centerClientX - contentRect.left
      const yInContent = centerClientY - contentRect.top

      const leftPct = clamp((xInContent / contentRect.width) * 90, 0, 100)
      const topPct = clamp((yInContent / contentRect.height) * 95, 0, 100)

      return {
        top: `${topPct.toFixed(2)}%`,
        left: `${leftPct.toFixed(2)}%`,
      }
    })()

    const newDecoration: ThemeCustomDecorations = {
      id: createDecorationId('decoration'),
      position,
      image: '/placeholder.svg?height=150&width=150',
      opacity: 1,
      scale: 1,
      responsiveScale: true,
      zIndex: 5,
      name: `Decoration ${decorations.length + 1}`,
    }

    addDecoration(newDecoration)
    setSelectedDecorationId(newDecoration.id)
  }

  const handleSelectDecoration = (id: string) => {
    if (selectedDecorationId !== id) {
      setSelectedDecorationId(id)
    }
  }

  const createRemoveDecorationHandler = (id: string) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    removeDecoration(id)
    if (selectedDecorationId === id) setSelectedDecorationId(null)
  }

  const handleClearDecorations = () => {
    resetDecorations()
    setSelectedDecorationId(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xs bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight">Decorations</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {decorations.length > 0 ? (
                  <span className="text-primary">{decorations.length} element{decorations.length > 1 ? 's' : ''}</span>
                ) : (
                  'Visual accents & assets'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/40 mx-5" />

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-8">
        {/* Controls: Animation & Add Button */}
        <div className="flex items-end gap-3 mt-2">
          <div className="flex-1 space-y-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Animation</Label>
            <Select
              value={themeCustomizations.decorationAnimation || 'fade'}
              onValueChange={(value) => updateThemeCustomization({ decorationAnimation: value as DecorationAnimation })}
            >
              <SelectTrigger className="h-9 rounded-sm border-border/20 bg-muted/20 hover:bg-muted/40 focus:ring-1 focus:ring-primary/30 text-[12px] transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-sm border-border/20">
                {decorationAnimationOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id} className="text-[12px] rounded-sm">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="sm"
            onClick={handleAddDecoration}
            className="h-9 px-4 text-[12px] font-medium rounded-sm bg-foreground text-background hover:bg-foreground/90 shadow-sm shrink-0 transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add New
          </Button>
        </div>

        {/* Decoration List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              Elements <span className="text-muted-foreground/40 font-normal ml-1">({decorations.length})</span>
            </Label>
            {decorations.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearDecorations}
                className="h-6 text-[11px] text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-full px-2.5 transition-colors"
              >
                Clear All
              </Button>
            )}
          </div>

          {decorations.length > 0 ? (
            <div className="space-y-2">
              {decorations.map((decoration) => {
                const isSelected = selectedDecorationId === decoration.id;
                
                return (
                  <div
                    key={decoration.id}
                    className={cn(
                      'group relative rounded-xs border transition-all duration-300 overflow-hidden cursor-pointer',
                      isSelected
                        ? 'bg-background border-border/80 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.08)]'
                        : 'bg-muted/10 border-border/20 hover:bg-muted/30'
                    )}
                    onClick={() => handleSelectDecoration(decoration.id)}
                  >
                    <div className="flex items-center p-2.5 gap-3">
                      {/* Image Preview */}
                      <div className={cn(
                        "w-12 h-12 rounded-xl overflow-hidden shrink-0 relative border transition-colors",
                        isSelected ? "border-border/40 bg-muted/20" : "border-border/10 bg-muted/10"
                      )}>
                        <Image
                          src={decoration.image || '/placeholder.svg'}
                          alt={decoration.name || "Decoration"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 min-w-0 py-0.5">
                        {/* 🌟 Главное изменение: Всегда видимый "Figma-style" Input */}
                        <Input
                          value={decoration.name || ''}
                          onChange={(e) => updateDecoration(decoration.id, { name: e.target.value })}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDecoration(decoration.id);
                          }}
                          placeholder="Unnamed Decoration"
                          className={cn(
                            "h-7 px-2 -ml-2 text-[13px] font-medium transition-all shadow-none rounded-2xs",
                            "bg-transparent border-transparent",
                            // Hover & Focus states
                            "hover:bg-muted/50 hover:border-border/30",
                            "focus-visible:bg-background focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/20",
                            // Text color based on selection
                            isSelected ? "text-foreground" : "text-foreground/80"
                          )}
                        />

                        {/* Scale and Opacity info */}
                        <div className="flex items-center gap-2 mt-0.5 px-0.5">
                          <span className="text-[10px] text-muted-foreground/70 font-medium tracking-wide">
                            Scale: {Math.round((decoration.scale ?? 1) * 100)}%
                          </span>
                          <span className="w-1 h-1 rounded-full bg-border/50" />
                          <span className="text-[10px] text-muted-foreground/70 font-medium tracking-wide">
                            Opacity: {Math.round(decoration.opacity * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Delete Button - Появляется при ховере группы (или если выбрано на мобилках) */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={createRemoveDecorationHandler(decoration.id)}
                        className={cn(
                          "h-8 w-8 p-0 rounded-full shrink-0 transition-all duration-200",
                          "text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10",
                          "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 focus-visible:opacity-100 focus-visible:translate-x-0",
                          isSelected && "opacity-100 translate-x-0 text-muted-foreground/70"
                        )}
                        aria-label="Delete decoration"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-border/40 rounded-2xl bg-muted/10">
              <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
              </div>
              <p className="text-[12px] font-medium text-foreground/80 mb-1">No decorations yet</p>
              <p className="text-[11px] text-muted-foreground/60 max-w-[180px]">
                Add visual accents to your canvas to make it stand out.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}