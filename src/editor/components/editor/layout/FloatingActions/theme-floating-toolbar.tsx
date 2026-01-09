"use client"

import { useId } from "react"
import { Palette, ImageIcon, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { useThemeSelector, useUiSelector } from "@/editor/lib/store"

export function ThemeFloatingToolbar() {
  const ownerId = useId()

  const { openDesignModal, openMediaPicker } = useUiSelector((state) => ({
    openDesignModal: state.openDesignModal,
    openMediaPicker: state.openMediaPicker,
  }))

  const { updateThemeCustomization } = useThemeSelector((state) => ({
    updateThemeCustomization: state.updateThemeCustomization,
  }))

  const iconButtonClassName =
    "h-8 w-8 p-0 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100"

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

        <Button
          type="button"
          variant="ghost"
          className={iconButtonClassName}
          title="Reset background"
          onClick={handleResetBackground}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
