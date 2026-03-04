"use client"

import { useThemeSelector, useUiSelector, type ThemeCustomDecorations } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getDecorations } from '@/editor/lib/decorations'
import { Plus, Trash2 } from 'lucide-react'
import { useMemo, MouseEvent, useState } from 'react'
import { cn } from '@/lib/utils'
import { useCanvasScrollContainer } from '@/editor/components/editor/canvas-scroll-context'
import Image from 'next/image'

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
  if (value && typeof value === 'object' && 'url' in value && typeof (value as any).url === 'string') {
    return (value as any).url
  }
  return ''
}

export function DecorationsSettingsPanel() {
  const canvasScrollRef = useCanvasScrollContainer()
  const [editingNameId, setEditingNameId] = useState<string | null>(null)
  const {
    currentTheme,
    themeCustomizations,
    updateThemeCustomization,
    customDecorations,
    addDecoration,
    updateDecoration,
    removeDecoration,
    resetDecorations,
    setDecorations,
  } = useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
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

  const themeDecorations = useMemo(() => getDecorations(currentTheme), [currentTheme])

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
      name: 'Decoration',
    }

    addDecoration(newDecoration)
    setSelectedDecorationId(newDecoration.id)
  }

  const handleSelectDecoration = (id: string) => {
    setSelectedDecorationId(selectedDecorationId === id ? null : id)
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

  const handleResetToPreset = () => {
    const preset = getDecorations(currentTheme)

    const mapped = (preset.elements || []).map((el: any, i: number) => ({
      id: createDecorationId(`preset-${currentTheme}-${i}`),
      position: {
        top: el.position?.top ?? '10%',
        left: el.position?.left ?? '10%',
        bottom: undefined,
        right: undefined,
      },
      image: coerceImageUrl(el.image) || '/placeholder.svg',
      opacity: el.opacity ?? 0.15,
      responsiveScale: el.responsiveScale ?? true,
      zIndex: el.zIndex || 0,
    }))

    setDecorations(mapped)
    updateThemeCustomization({ decorationAnimation: preset.animation || 'fade' })
    setSelectedDecorationId(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border/60">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Decorations</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Visual accents</p>
          </div>
          <Button
            size="sm"
            onClick={handleResetToPreset}
            variant="ghost"
            className="h-8 text-xs font-medium rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            Reset to Preset
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        {/* Animation and Add Button in one row */}
        <div className="pt-4 flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Animation</Label>
            <Select
              value={themeCustomizations.decorationAnimation || themeDecorations?.animation || 'fade'}
              onValueChange={(value) => updateThemeCustomization({ decorationAnimation: value as any })}
            >
              <SelectTrigger className="h-9 rounded-xl border-border bg-background hover:bg-muted/50 focus:ring-ring text-xs transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="fade">Fade In</SelectItem>
                <SelectItem value="slide-up">Slide Up</SelectItem>
                <SelectItem value="slide-down">Slide Down</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            size="sm"
            onClick={handleAddDecoration}
            className="h-9 text-xs font-medium rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-sm px-4 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add
          </Button>
        </div>

        {/* Decoration List */}
        {decorations.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Elements ({decorations.length})</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearDecorations}
                className="h-7 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl px-2.5"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-2">
              {decorations.map((decoration, index) => (
                <div
                  key={decoration.id}
                  className={cn(
                    'rounded-xl transition-all duration-200 overflow-hidden cursor-pointer',
                    selectedDecorationId === decoration.id
                      ? 'bg-muted/50 ring-1 ring-ring shadow-sm'
                      : 'bg-background hover:bg-muted/30',
                  )}
                  onClick={() => handleSelectDecoration(decoration.id)}
                >
                  <div className="flex items-center justify-between p-3 gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Image preview */}
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-muted/50 shrink-0 relative border border-border/50">
                        <Image
                          src={decoration.image || '/placeholder.svg'}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Editable name */}
                        {editingNameId === decoration.id ? (
                          <Input
                            autoFocus
                            value={decoration.name || 'Decoration'}
                            onChange={(e) => updateDecoration(decoration.id, { name: e.target.value })}
                            onBlur={() => setEditingNameId(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setEditingNameId(null)
                              if (e.key === 'Escape') {
                                setEditingNameId(null)
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-7 text-sm font-medium px-2 py-0"
                          />
                        ) : (
                          <p
                            className={cn(
                              'text-sm font-medium transition-colors truncate cursor-text',
                              selectedDecorationId === decoration.id ? 'text-foreground' : 'text-foreground/80',
                            )}
                            onDoubleClick={(e) => {
                              e.stopPropagation()
                              setEditingNameId(decoration.id)
                            }}
                          >
                            {decoration.name || 'Decoration'}
                          </p>
                        )}

                        {/* Scale and Opacity info */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground font-medium">
                            Scale: {Math.round((decoration.scale ?? 1) * 100)}%
                          </span>
                          <span className="text-[10px] text-muted-foreground/40">•</span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            Opacity: {Math.round(decoration.opacity * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={createRemoveDecorationHandler(decoration.id)}
                      className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground text-xs">No decorations added yet.</div>
        )}
      </div>
    </div>
  )
}
