"use client"

import { useThemeStore, ThemeCustomDecorations, useUiStore } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getTheme } from '@/editor/lib/themes'
import { getDecorations } from '@/editor/lib/decorations'
import { BACKGROUND_MODE_PRESETS, type BackgroundImageMode } from '@/editor/lib/background'
import { Plus, Trash2, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ThemeSettingsPanel() {
  const { 
    currentTheme, 
    themeCustomizations, 
    updateThemeCustomization,
    customDecorations,
    addDecoration,
    updateDecoration,
    removeDecoration,
    resetDecorations,
    setDecorations
  } = useThemeStore()
  
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

  const handleToggleDecoration = (id: string) => {
    setSelectedDecorationId(prev => prev === id ? null : id)
  }

  const createRemoveDecorationHandler = (id: string) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    removeDecoration(id)
    if (selectedDecorationId === id) {
      setSelectedDecorationId(null)
    }
  }

  const allDecorations = customDecorations

  const backgroundImageUrl = themeCustomizations.customBackground || themeDecorations?.backgroundImage?.url || ''
  const backgroundOpacity =
    themeCustomizations.backgroundImageOpacity ??
    themeDecorations?.backgroundImage?.opacity ??
    0.15

  const backgroundMode: BackgroundImageMode =
    (themeCustomizations.backgroundImageType ??
      themeDecorations?.backgroundImage?.type ??
      'fixed') as BackgroundImageMode

  const backgroundModeOptions = Object.keys(BACKGROUND_MODE_PRESETS) as BackgroundImageMode[]
  const formatBackgroundModeLabel = (mode: BackgroundImageMode) =>
    mode.charAt(0).toUpperCase() + mode.slice(1)

  return (
    <div className="h-full flex flex-col">
      {/* Media picker used for choosing background */}
      <MediaPickerModal onSelectImage={handleBackgroundImageSelect} />

      {/* Header */}
      <div className="p-6 pb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            Theme & Background
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Customize appearance
          </p>
        </div>
        <Button 
            size="sm" 
            onClick={handleApplyThemePreset} 
            variant="outline"
            className="h-8 text-[10px] font-medium uppercase tracking-wide rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900"
        >
          Reset to Preset
        </Button>
      </div>

      <Tabs defaultValue="background" className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="decorations">Decorations</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <TabsContent value="background" className="space-y-6 mt-0">
            {/* Background image */}
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
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Change
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                    <div className="p-3 rounded-full bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">Select Image</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
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
                  <>
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

                    <div className="space-y-2">
                      <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
                        Mode
                      </Label>
                      <Select
                        value={backgroundMode}
                        onValueChange={(value) =>
                          updateThemeCustomization({ backgroundImageType: value as BackgroundImageMode })
                        }
                      >
                        <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {backgroundModeOptions.map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {formatBackgroundModeLabel(mode)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="decorations" className="space-y-6 mt-0">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-slate-900">Elements</Label>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Visual accents</p>
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
            {allDecorations.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">List ({allDecorations.length})</Label>
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
                  {allDecorations.map((decoration, index) => (
                    <div
                      key={decoration.id}
                      className={cn(
                        "rounded-xl border transition-all duration-200 overflow-hidden",
                        selectedDecorationId === decoration.id
                          ? 'border-slate-900 bg-white shadow-sm ring-1 ring-slate-900/5'
                          : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'
                      )}
                    >
                      {/* Header / Summary */}
                      <div 
                        className="flex items-center justify-between p-2 cursor-pointer"
                        onClick={() => handleToggleDecoration(decoration.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                              "w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-colors",
                              selectedDecorationId === decoration.id ? "bg-slate-50" : "bg-slate-50"
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

                      {/* Expanded Editing Controls */}
                      {selectedDecorationId === decoration.id && (
                        <div className="p-3 bg-slate-50/50 border-t border-slate-100 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Type</Label>
                                <Select 
                                value={decoration.type} 
                                onValueChange={(value) => updateDecoration(decoration.id, { type: value as any })}
                                >
                                <SelectTrigger className="h-8 rounded-lg border-slate-200 bg-white focus:ring-slate-900 text-xs">
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
                                value={decoration.size} 
                                onValueChange={(value) => updateDecoration(decoration.id, { size: value as any })}
                                >
                                <SelectTrigger className="h-8 rounded-lg border-slate-200 bg-white focus:ring-slate-900 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                    <SelectItem value="xlarge">Extra Large</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Top</Label>
                                <Input
                                    type="text"
                                    value={decoration.position.top || ''}
                                    onChange={(e) => updateDecoration(decoration.id, {
                                    position: { ...decoration.position, top: e.target.value, bottom: undefined }
                                    })}
                                    placeholder="10%"
                                    className="h-8 rounded-lg border-slate-200 text-xs bg-white"
                                />
                                </div>
                                <div className="space-y-1">
                                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Bottom</Label>
                                <Input
                                    type="text"
                                    value={decoration.position.bottom || ''}
                                    onChange={(e) => updateDecoration(decoration.id, {
                                    position: { ...decoration.position, bottom: e.target.value, top: undefined }
                                    })}
                                    placeholder="-"
                                    className="h-8 rounded-lg border-slate-200 text-xs bg-white"
                                />
                                </div>
                                <div className="space-y-1">
                                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Left</Label>
                                <Input
                                    type="text"
                                    value={decoration.position.left || ''}
                                    onChange={(e) => updateDecoration(decoration.id, {
                                    position: { ...decoration.position, left: e.target.value, right: undefined }
                                    })}
                                    placeholder="10%"
                                    className="h-8 rounded-lg border-slate-200 text-xs bg-white"
                                />
                                </div>
                                <div className="space-y-1">
                                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Right</Label>
                                <Input
                                    type="text"
                                    value={decoration.position.right || ''}
                                    onChange={(e) => updateDecoration(decoration.id, {
                                    position: { ...decoration.position, right: e.target.value, left: undefined }
                                    })}
                                    placeholder="-"
                                    className="h-8 rounded-lg border-slate-200 text-xs bg-white"
                                />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
                                Opacity
                                </Label>
                                <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 h-8 px-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={decoration.opacity}
                                    onChange={(e) => updateDecoration(decoration.id, { opacity: parseFloat(e.target.value) })}
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
                                value={decoration.zIndex && decoration.zIndex > 5 ? 'front' : 'behind'} 
                                onValueChange={(value) => updateDecoration(decoration.id, { 
                                    zIndex: value === 'front' ? 10 : 1 
                                })}
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
              <div className="text-center py-8 text-slate-400 text-xs">
                No decorations added yet.
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
