"use client"

import { useThemeSelector, useUiSelector } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getDecorations } from '@/editor/lib/decorations'
import { BACKGROUND_MODE_PRESETS, type BackgroundImageMode } from '@/editor/lib/background'
import { ImageIcon, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeSettingsPanel() {
  const { currentTheme, themeCustomizations, updateThemeCustomization } = useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
    themeCustomizations: state.themeCustomizations,
    updateThemeCustomization: state.updateThemeCustomization,
  }))

  const { toggleMediaPicker } = useUiSelector((state) => ({
    toggleMediaPicker: state.toggleMediaPicker,
  }))

  const themeDecorations = getDecorations(currentTheme)

  const handleBackgroundImageSelect = (url: string) => {
    updateThemeCustomization({ customBackground: url })
  }

  const handleApplyThemePreset = () => {
    const preset = getDecorations(currentTheme)
    if (preset.backgroundImage) {
      updateThemeCustomization({
        customBackground: preset.backgroundImage.url,
        backgroundImageOpacity: preset.backgroundImage.opacity,
        backgroundImageType: preset.backgroundImage.type,
      })
    } else {
      updateThemeCustomization({
        customBackground: undefined,
      })
    }
  }

  const handleToggleMediaPicker = () => {
    toggleMediaPicker()
  }

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

      <div className="flex-1 overflow-y-auto px-6 pb-6">
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
      </div>
    </div>
  )
}
