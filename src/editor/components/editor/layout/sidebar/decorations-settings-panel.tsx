"use client"

import { useThemeStore, type ThemeCustomDecorations } from '@/editor/lib/store'
import { useUiStore } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getDecorations } from '@/editor/lib/decorations'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo, MouseEvent } from 'react'
import { cn } from '@/lib/utils'

const coerceImageUrl = (value: unknown) => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'url' in value && typeof (value as any).url === 'string') {
    return (value as any).url
  }
  return ''
}

export function DecorationsSettingsPanel() {
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
  } = useThemeStore()

  const { selectedDecorationId, setSelectedDecorationId } = useUiStore()

  const themeDecorations = getDecorations(currentTheme)

  const decorations = useMemo(() => customDecorations, [customDecorations])

  const handleAddDecoration = () => {
    const newDecoration: ThemeCustomDecorations = {
      id: `decoration-${Date.now()}`,
      position: { top: '10%', left: '10%' },
      image: '/placeholder.svg?height=150&width=150',
      opacity: 0.15,
      scale: 1,
      responsiveScale: false,
      zIndex: 5,
    }

    addDecoration(newDecoration)
    setSelectedDecorationId(newDecoration.id)
  }

  const handleToggleDecoration = (id: string) => {
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
      id: `preset-${currentTheme}-${i}-${Date.now()}`,
      position: {
        top: el.position?.top ?? '10%',
        left: el.position?.left ?? '10%',
        bottom: undefined,
        right: undefined,
      },
      image: coerceImageUrl(el.image) || '/placeholder.svg',
      opacity: el.opacity ?? 0.15,
      responsiveScale: false,
      zIndex: el.zIndex || 0,
    }))

    setDecorations(mapped)
    updateThemeCustomization({ decorationAnimation: preset.animation || 'fade' })
    setSelectedDecorationId(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 pb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            Decorations
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Visual accents
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleResetToPreset}
          variant="outline"
          className="h-8 text-[10px] font-medium uppercase tracking-wide rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900"
        >
          Reset to Preset
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium text-slate-900">Elements</Label>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Custom elements only</p>
          </div>
          <Button
            size="sm"
            onClick={handleAddDecoration}
            className="h-8 text-[10px] font-medium uppercase tracking-wide rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10 px-4"
          >
            <Plus className="w-3 h-3 mr-1.5" />
            Add
          </Button>
        </div>

        {/* Global Animation */}
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Animation</Label>
          <Select
            value={themeCustomizations.decorationAnimation || themeDecorations?.animation || 'fade'}
            onValueChange={(value) => updateThemeCustomization({ decorationAnimation: value as any })}
          >
            <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs">
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

        {/* Decoration List */}
        {decorations.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">List ({decorations.length})</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearDecorations}
                className="h-6 text-[10px] text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full px-2"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-2">
              {decorations.map((decoration, index) => (
                <div
                  key={decoration.id}
                  className={cn(
                    'rounded-xl border transition-all duration-200 overflow-hidden',
                    selectedDecorationId === decoration.id
                      ? 'border-slate-900 bg-white shadow-sm ring-1 ring-slate-900/5'
                      : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm',
                  )}
                >
                  <div
                    className="flex items-center justify-between p-2 cursor-pointer"
                    onClick={() => handleToggleDecoration(decoration.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-semibold bg-slate-50 text-slate-400')}>
                        IMG
                      </div>
                      <div>
                        <p
                          className={cn(
                            'text-xs font-medium capitalize transition-colors',
                            selectedDecorationId === decoration.id ? 'text-slate-900' : 'text-slate-600',
                          )}
                        >
                          Decoration
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">Element {index + 1}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={createRemoveDecorationHandler(decoration.id)}
                        className="h-7 w-7 p-0 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <div className="h-7 w-7 flex items-center justify-center text-slate-400">
                        {selectedDecorationId === decoration.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedDecorationId === decoration.id && (
                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Image URL</Label>
                        <Input
                          type="text"
                          value={decoration.image || ''}
                          onChange={(e) => updateDecoration(decoration.id, { image: e.target.value })}
                          placeholder="https://..."
                          className="h-8 rounded-lg border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Scale</Label>
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0.1}
                          step={0.1}
                          value={decoration.scale ?? 1}
                          onChange={(e) => {
                            const next = Number(e.target.value)
                            updateDecoration(decoration.id, { scale: Number.isFinite(next) && next > 0 ? next : 1 })
                          }}
                          className="h-8 rounded-lg border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Top</Label>
                          <Input
                            type="text"
                            value={decoration.position.top || ''}
                            onChange={(e) =>
                              updateDecoration(decoration.id, {
                                position: { ...decoration.position, top: e.target.value, bottom: undefined },
                              })
                            }
                            placeholder="10%"
                            className="h-8 rounded-lg border-slate-200 text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Left</Label>
                          <Input
                            type="text"
                            value={decoration.position.left || ''}
                            onChange={(e) =>
                              updateDecoration(decoration.id, {
                                position: { ...decoration.position, left: e.target.value, right: undefined },
                              })
                            }
                            placeholder="10%"
                            className="h-8 rounded-lg border-slate-200 text-xs bg-white"
                          />
                        </div>
                      </div>

                      <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <span className="text-[11px] font-medium text-slate-700">Mobile adaptation</span>
                        <input
                          type="checkbox"
                          checked={Boolean(decoration.responsiveScale)}
                          onChange={(e) => updateDecoration(decoration.id, { responsiveScale: e.target.checked })}
                          className="h-4 w-4 accent-slate-900"
                        />
                      </label>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Opacity</Label>
                        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 h-8 px-3">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={decoration.opacity}
                            onChange={(e) =>
                              updateDecoration(decoration.id, { opacity: parseFloat(e.target.value) })
                            }
                            className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900"
                          />
                          <span className="text-[10px] font-medium text-slate-500 w-8 text-right tabular-nums">
                            {Math.round(decoration.opacity * 100)}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Layer</Label>
                        <Select
                          value={decoration.zIndex != null && decoration.zIndex >= 20 ? 'front' : 'behind'}
                          onValueChange={(value) =>
                            updateDecoration(decoration.id, {
                              // Canvas content is rendered with z-10; so use >10 for front
                              zIndex: value === 'front' ? 20 : 5,
                            })
                          }
                        >
                          <SelectTrigger className="h-8 rounded-lg border-slate-200 bg-white focus:ring-slate-900 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="behind">Behind Content</SelectItem>
                            <SelectItem value="front">In Front</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">No decorations added yet.</div>
        )}
      </div>
    </div>
  )
}
