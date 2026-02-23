"use client"

import { useId } from "react"
import { ImageIcon, Palette, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { useThemeSelector, useUiSelector } from "@/editor/lib/store"
import { BACKGROUND_MODE_PRESETS, type BackgroundImageMode } from "@/editor/lib/background"
import { getDecorations } from "@/editor/lib/decorations"

export function ThemeFloatingToolbar() {
  const ownerId = useId()

  const { openDesignModal, openMediaPicker } = useUiSelector((state) => ({
    openDesignModal: state.openDesignModal,
    openMediaPicker: state.openMediaPicker,
  }))

  const { currentTheme, themeCustomizations, updateThemeCustomization } = useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
    themeCustomizations: state.themeCustomizations,
    updateThemeCustomization: state.updateThemeCustomization,
  }))

  const themeDecorations = getDecorations(currentTheme)

  const backgroundOpacity =
    themeCustomizations.backgroundImageOpacity ?? themeDecorations?.backgroundImage?.opacity ?? 0.15

  const backgroundMode =
    (themeCustomizations.backgroundImageType ??
      themeDecorations?.backgroundImage?.type ??
      "fixed") as BackgroundImageMode

  const iconButtonClassName =
    "h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"

  const handleUpdateOpacity = (value: number) => {
    const clamped = Math.min(Math.max(value, 0), 1)
    updateThemeCustomization({ backgroundImageOpacity: parseFloat(clamped.toFixed(2)) })
  }

  const handleResetBackground = () => {
    updateThemeCustomization({
      customBackground: undefined,
      backgroundImageOpacity: undefined,
      backgroundImageType: undefined,
    })
  }

  return (
    <>
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url) => updateThemeCustomization({ customBackground: url })}
      />

      <div className="h-10 px-1 flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          className={iconButtonClassName}
          title="Choose theme"
          onClick={() => openDesignModal("themes")}
        >
          <Palette className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          className={iconButtonClassName}
          title="Change background image"
          onClick={() => openMediaPicker(ownerId)}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className={iconButtonClassName}
              title="Background settings"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={10} className="w-64 p-4 rounded-2xl border-border/60 shadow-lg">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Scroll type</Label>
                <Select
                  value={backgroundMode}
                  onValueChange={(val) =>
                    updateThemeCustomization({ backgroundImageType: val as BackgroundImageMode })
                  }
                >
                  <SelectTrigger className="h-8 rounded-xl text-xs border-border/60">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Object.keys(BACKGROUND_MODE_PRESETS).map((mode) => (
                      <SelectItem key={mode} value={mode} className="text-xs">
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Image opacity</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {Math.round(backgroundOpacity * 100)}%
                  </span>
                </div>
                <Slider
                  value={[Math.round(backgroundOpacity * 100)]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={([v]) => handleUpdateOpacity((v ?? 0) / 100)}
                />
              </div>

              <div className="pt-1 border-t border-border/40 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs rounded-xl text-muted-foreground hover:text-foreground"
                  onClick={handleResetBackground}
                >
                  Reset background
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
