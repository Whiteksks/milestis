"use client"

import { useThemeStore, ThemeCustomDecorations, useUiStore } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/ui/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getTheme } from '@/editor/lib/themes'
import { getDecorations } from '@/editor/lib/decorations'
import { Plus, Trash2, ImageIcon } from 'lucide-react'
import { useState, MouseEvent } from 'react'
import { cn } from '@/lib/utils'

export function ThemeSettingsPanel() {
  const { 
    currentTheme, 
    themeCustomizations, 
    updateThemeCustomization,
    customDecorations,
    addDecoration,
    updateDecoration,
    removeDecoration,
    resetDecorations
  } = useThemeStore()
  const { setDecorations } = useThemeStore()
  const { toggleMediaPicker } = useUiStore()

  const theme = getTheme(currentTheme)
  const themeDecorations = getDecorations(currentTheme)
  const [selectedDecorationId, setSelectedDecorationId] = useState<string | null>(null)

  const handleBackgroundImageSelect = (url: string) => {
    updateThemeCustomization({ customBackground: url })
  }

  const handleAddDecoration = () => {
    const newDecoration: ThemeCustomDecorations = {
      id: `decoration-${Date.now()}`,
      type: 'flower',
      position: { top: '10%', left: '10%' },
      image: '/placeholder.svg?height=150&width=150',
      opacity: 0.15,
      size: 'medium',
      zIndex: 5
    }
    addDecoration(newDecoration)
    setSelectedDecorationId(newDecoration.id)
  }

  const handleApplyThemePreset = () => {
    const preset = getDecorations(currentTheme)
    const mapped = (preset.elements || []).map((el: any, i: number) => ({
      id: `preset-${i}-${Date.now()}`,
      type: el.type,
      position: el.position || {},
      image: el.image || '/placeholder.svg',
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
  }

  const handleToggleMediaPicker = () => {
    toggleMediaPicker()
  }

  const handleClearDecorations = () => {
    resetDecorations()
  }

  const createSelectDecorationHandler = (id: string) => () => {
    setSelectedDecorationId(id)
  }

  const createRemoveDecorationHandler = (id: string) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    removeDecoration(id)
    if (selectedDecorationId === id) {
      setSelectedDecorationId(null)
    }
  }

  const selectedDecoration = customDecorations.find(d => d.id === selectedDecorationId)

  const allDecorations = customDecorations

  const backgroundImageUrl = themeCustomizations.customBackground || themeDecorations?.backgroundImage?.url || ''
  const backgroundOpacity =
    themeCustomizations.backgroundImageOpacity ??
    themeDecorations?.backgroundImage?.opacity ??
    0.15

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">
      {/* Media picker used for choosing background */}
      <MediaPickerModal onSelectImage={handleBackgroundImageSelect} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            Theme & Background
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Manage site background and decorative elements.
          </p>
        </div>
        <Button 
            size="sm" 
            onClick={handleApplyThemePreset} 
            variant="outline"
            className="h-8 text-[10px] font-medium uppercase tracking-wide rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900"
        >
          Apply Preset
        </Button>
      </div>

      {/* Background image */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Background Image</h4>

        <div className="space-y-4">
          <div
            onClick={handleToggleMediaPicker}
            className={cn(
              "group relative aspect-video w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 cursor-pointer overflow-hidden flex items-center justify-center",
              backgroundImageUrl && "border-none bg-white shadow-md shadow-slate-900/5"
            )}
          >
            {backgroundImageUrl ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                    opacity: backgroundOpacity,
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="rounded-full shadow-lg bg-white text-slate-900 hover:bg-slate-50 font-medium text-xs h-8 px-4"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Change Background
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                <div className="p-3 rounded-full bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">Select Background Image</span>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
                Direct Link
              </Label>
              <Input
                type="text"
                value={themeCustomizations.customBackground || ''}
                onChange={(e) => updateThemeCustomization({ customBackground: e.target.value })}
                placeholder="https://..."
                className="h-9 rounded-xl border-slate-200 bg-white focus-visible:ring-slate-900 text-xs"
              />
            </div>

            {backgroundImageUrl && (
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
                  Opacity
                </Label>
                <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-100 h-9 px-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={backgroundOpacity}
                    onChange={(e) =>
                      updateThemeCustomization({
                        backgroundImageOpacity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900"
                  />
                  <span className="text-[10px] font-medium text-slate-500 w-8 text-right tabular-nums">
                    {Math.round(backgroundOpacity * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {backgroundImageUrl && (
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
                Scroll Behavior
              </Label>
              <Select
                value={themeCustomizations.backgroundImageType || 'fixed'}
                onValueChange={(value) =>
                  updateThemeCustomization({ backgroundImageType: value as 'fixed' | 'scroll' })
                }
              >
                <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed (stays in place)</SelectItem>
                  <SelectItem value="scroll">Scroll (moves with page)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium text-slate-900">Decorative Elements</Label>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Add visual accents to your page</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleAddDecoration}
              className="h-8 text-[10px] font-medium uppercase tracking-wide rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10 px-4"
            >
              <Plus className="w-3 h-3 mr-1.5" />
              Add
            </Button>
          </div>
        </div>

        {/* Global Animation */}
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Animation Style</Label>
          <Select 
            value={themeCustomizations.decorationAnimation || 'fade'} 
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
        {allDecorations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Your Elements ({allDecorations.length})</Label>
              {allDecorations.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearDecorations}
                  className="h-6 text-[10px] text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full px-2"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {allDecorations.map((decoration, index) => (
                <div
                  key={decoration.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all duration-200 group",
                    selectedDecorationId === decoration.id
                      ? 'border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900/5'
                      : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'
                  )}
                  onClick={createSelectDecorationHandler(decoration.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-colors",
                        selectedDecorationId === decoration.id ? "bg-white shadow-sm" : "bg-slate-50 group-hover:bg-slate-100"
                    )}>
                      {decoration.type === 'flower' ? '🌸' : 
                       decoration.type === 'dove' ? '🕊️' :
                       decoration.type === 'shapes' ? '⬡' : '○'}
                    </div>
                    <div>
                      <p className={cn(
                          "text-xs font-medium capitalize transition-colors",
                          selectedDecorationId === decoration.id ? "text-slate-900" : "text-slate-600"
                      )}>{decoration.type}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Element {index + 1}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={createRemoveDecorationHandler(decoration.id)}
                    className="h-7 w-7 p-0 rounded-full text-slate-400 hover:bg-white hover:text-red-500 hover:shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Decoration Editor */}
        {selectedDecoration && (
          <div className="border-t border-slate-100 pt-6 mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Edit Element</Label>
                <span className="text-[10px] text-slate-400 font-mono">{selectedDecoration.id.split('-')[1]}</span>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Element Type</Label>
              <Select 
                value={selectedDecoration.type} 
                onValueChange={(value) => updateDecoration(selectedDecoration.id, { type: value as any })}
              >
                <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flower">🌸 Flower</SelectItem>
                  <SelectItem value="dove">🕊️ Dove</SelectItem>
                  <SelectItem value="shapes">⬡ Shapes</SelectItem>
                  <SelectItem value="bubbles">○ Bubbles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Size</Label>
              <Select 
                value={selectedDecoration.size} 
                onValueChange={(value) => updateDecoration(selectedDecoration.id, { size: value as any })}
              >
                <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (100px)</SelectItem>
                  <SelectItem value="medium">Medium (150px)</SelectItem>
                  <SelectItem value="large">Large (200px)</SelectItem>
                  <SelectItem value="xlarge">Extra Large (300px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Top</Label>
                <Input
                  type="text"
                  value={selectedDecoration.position.top || ''}
                  onChange={(e) => updateDecoration(selectedDecoration.id, {
                    position: { ...selectedDecoration.position, top: e.target.value, bottom: undefined }
                  })}
                  placeholder="10%"
                  className="h-8 rounded-lg border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Bottom</Label>
                <Input
                  type="text"
                  value={selectedDecoration.position.bottom || ''}
                  onChange={(e) => updateDecoration(selectedDecoration.id, {
                    position: { ...selectedDecoration.position, bottom: e.target.value, top: undefined }
                  })}
                  placeholder="-"
                  className="h-8 rounded-lg border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Left</Label>
                <Input
                  type="text"
                  value={selectedDecoration.position.left || ''}
                  onChange={(e) => updateDecoration(selectedDecoration.id, {
                    position: { ...selectedDecoration.position, left: e.target.value, right: undefined }
                  })}
                  placeholder="10%"
                  className="h-8 rounded-lg border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Right</Label>
                <Input
                  type="text"
                  value={selectedDecoration.position.right || ''}
                  onChange={(e) => updateDecoration(selectedDecoration.id, {
                    position: { ...selectedDecoration.position, right: e.target.value, left: undefined }
                  })}
                  placeholder="-"
                  className="h-8 rounded-lg border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
                Opacity
              </Label>
              <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-100 h-9 px-3">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selectedDecoration.opacity}
                    onChange={(e) => updateDecoration(selectedDecoration.id, { opacity: parseFloat(e.target.value) })}
                    className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900"
                />
                <span className="text-[10px] font-medium text-slate-500 w-8 text-right tabular-nums">
                    {Math.round(selectedDecoration.opacity * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Layer Position</Label>
              <Select 
                value={selectedDecoration.zIndex && selectedDecoration.zIndex > 5 ? 'front' : 'behind'} 
                onValueChange={(value) => updateDecoration(selectedDecoration.id, { 
                  zIndex: value === 'front' ? 10 : 1 
                })}
              >
                <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="behind">Behind Elements (Background)</SelectItem>
                  <SelectItem value="front">In Front of Elements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Image URL</Label>
              <Input
                type="text"
                value={selectedDecoration.image}
                onChange={(e) => updateDecoration(selectedDecoration.id, { image: e.target.value })}
                placeholder="/placeholder.svg"
                className="h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
