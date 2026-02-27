"use client"

import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUiSelector } from "@/editor/lib/store"

export function ThemeFloatingToolbar() {
  const { openDesignModal } = useUiSelector((state) => ({
    openDesignModal: state.openDesignModal,
  }))

  const iconButtonClassName =
    "h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"

  return (
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
    </div>
  )
}
