"use client"

import { useThemeSelector, useUiSelector } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getDecorations } from '@/editor/lib/decorations'
import { BACKGROUND_MODE_PRESETS, type BackgroundImageMode } from '@/editor/lib/background'
import { ImageIcon, Plus, Minus, RotateCcw, Link2, Settings2 } from 'lucide-react'
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

  // Получаем дефолтные настройки темы
  const themeDecorations = getDecorations(currentTheme)
  
  const backgroundImageUrl = themeCustomizations.customBackground || themeDecorations?.backgroundImage?.url || ''
  const backgroundOpacity = themeCustomizations.backgroundImageOpacity ?? themeDecorations?.backgroundImage?.opacity ?? 0.15
  const backgroundMode = (themeCustomizations.backgroundImageType ?? themeDecorations?.backgroundImage?.type ?? 'fixed') as BackgroundImageMode

  const handleUpdateOpacity = (value: number) => {
    const clamped = Math.min(Math.max(value, 0), 1)
    updateThemeCustomization({ backgroundImageOpacity: parseFloat(clamped.toFixed(2)) })
  }

  // Полный сброс всех кастомизаций фона до значений из конфига темы
  const handleResetToDefault = () => {
    updateThemeCustomization({ 
      customBackground: undefined,
      backgroundImageOpacity: undefined,
      backgroundImageType: undefined 
    })
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <MediaPickerModal onSelectImage={(url) => updateThemeCustomization({ customBackground: url })} />

      {/* Header */}
      <div className="p-6 pb-5 flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium uppercase tracking-wider text-slate-900">
            Appearance
          </h3>
          <p className="text-xs text-slate-400">Theme & Background</p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetToDefault}
          className="h-8 px-3 text-[10px] uppercase tracking-tight border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all flex gap-2"
        >
          <RotateCcw className="w-3 h-3" />
          Reset to default
        </Button>
      </div>

      <div className="px-6 space-y-5">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Image Preview Area */}
          <div 
            onClick={() => toggleMediaPicker()}
            className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-slate-50 flex items-center justify-center border-b border-slate-100"
          >
            {backgroundImageUrl ? (
              <>
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${backgroundImageUrl})`, opacity: backgroundOpacity }}
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="flex items-center gap-2 rounded-lg bg-white/95 p-1.5 px-3 shadow-lg">
                    <Plus className="w-3.5 h-3.5 text-slate-900" />
                    <span className="text-xs font-medium text-slate-900">Change Background</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                <span className="text-xs">Select Image</span>
              </div>
            )}
          </div>

          {/* Quick Settings Toolbar */}
          <div className="flex items-center justify-between p-1 bg-white">
            <div className="flex items-center flex-1">
              <Select
                value={backgroundMode}
                onValueChange={(val) => updateThemeCustomization({ backgroundImageType: val as BackgroundImageMode })}
              >
                <SelectTrigger className="h-8 border-none shadow-none bg-transparent hover:bg-slate-50 text-xs focus:ring-0 px-2 transition-colors shrink-0 w-auto">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(BACKGROUND_MODE_PRESETS).map((mode) => (
                    <SelectItem key={mode} value={mode} className="text-xs">
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-px h-4 bg-slate-100 mx-1" />

              {/* Opacity Stepper */}
              <div className="flex items-center gap-0.5 bg-slate-50/50 rounded-md p-0.5">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-slate-400 hover:bg-white hover:text-slate-900"
                  onClick={(e) => { e.stopPropagation(); handleUpdateOpacity(backgroundOpacity - 0.05); }}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <Input 
                  className="h-6 w-10 border-none bg-transparent text-xs text-slate-900 text-center focus-visible:ring-0 px-0 shadow-none font-medium"
                  value={`${Math.round(backgroundOpacity * 100)}%`}
                  onChange={(e) => {
                     const val = parseInt(e.target.value.replace('%', ''))
                     if (!isNaN(val)) handleUpdateOpacity(val / 100)
                  }}
                />

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-slate-400 hover:bg-white hover:text-slate-900"
                  onClick={(e) => { e.stopPropagation(); handleUpdateOpacity(backgroundOpacity + 0.05); }}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="w-px h-4 bg-slate-100 mx-1" />

            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              title="Advanced Settings"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Direct Link Section */}
        <div className="space-y-1.5 px-0.5">
          <div className="flex items-center gap-2 text-slate-400 ml-1">
            <Link2 className="w-3 h-3" />
            <Label className="text-[10px] uppercase tracking-widest font-medium">Direct Link</Label>
          </div>
          <Input
            type="text"
            value={themeCustomizations.customBackground || ''}
            onChange={(e) => updateThemeCustomization({ customBackground: e.target.value })}
            placeholder="Paste image URL..."
            className="h-9 rounded-xl border-slate-200 bg-transparent focus-visible:ring-slate-900 text-xs transition-all placeholder:text-slate-300 italic shadow-none"
          />
        </div>
      </div>
    </div>
  )
}