"use client"

import type { ComponentType } from "react"
import type { EditorMode } from "@/editor/lib/types"
import { useUiSelector } from "@/editor/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Moon, Sun, RotateCcw } from "lucide-react"
import { EffectCard } from "../../sidebar/effect-card"
import {
  usePortfolioThemeToolbar,
  usePhotobookThemeToolbar,
} from "@/editor/hooks/use-theme-toolbar"

// ─── Registry (mirrors ThemeFloatingToolbar) ──────────────────────────────────

const SHEET_REGISTRY: Record<EditorMode, ComponentType> = {
  portfolio: PortfolioThemeSheetActions,
  photobook: PhotobookThemeSheetActions,
}

/**
 * Mobile sheet snap-2 quick-actions for the Background tab.
 * Same logic as ThemeFloatingToolbar — touch-friendly sizing only.
 */
export function ThemeSheetActions() {
  const editorMode = useUiSelector((s) => s.editorMode)
  const Actions = SHEET_REGISTRY[editorMode]
  return <Actions />
}

// ─── Chip style helpers ───────────────────────────────────────────────────────

const CHIP =
  "h-10 px-3.5 rounded-xl text-sm font-medium transition-colors shrink-0"

const ICON_CHIP =
  "h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"

// ─── EffectChip — same popover as desktop, touch-sized trigger ───────────────

function EffectChip({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { id: string; label: string }[]
  onChange: (v: string) => void
}) {
  const isActive = value !== "none"
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            CHIP,
            isActive
              ? "text-primary hover:bg-primary/15 hover:text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
          )}
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={8}
        align="center"
        className="w-auto min-w-[200px] p-4 rounded-2xl border-border/60 shadow-lg m-2"
      >
        <EffectCard
          label={label}
          value={value}
          columns={3}
          options={options}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  )
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

function PortfolioThemeSheetActions() {
  const {
    depth, rays, texture,
    isDark, isFixed, canReset,
    handleReset, toggleDarkLight, toggleScrollMode,
    setDepth, setRays, setTexture,
    depthOptions, raysOptions, textureOptions,
  } = usePortfolioThemeToolbar()

  return (
    <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto no-scrollbar">

      {/* Dark / light */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title={isDark ? "Switch to light background" : "Switch to dark background"}
        className={ICON_CHIP}
        onClick={toggleDarkLight}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      {/* Fixed / Scroll */}
      <Button
        type="button"
        variant="ghost"
        className={cn(
          CHIP,
          !isFixed
            ? "text-foreground hover:bg-muted/80"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        )}
        onClick={toggleScrollMode}
      >
        {isFixed ? "Fixed" : "Scroll"}
      </Button>

      <Separator orientation="vertical" className="mx-0.5 h-5 bg-border/60 shrink-0" />

      <EffectChip label="Depth"   value={depth}   options={depthOptions}   onChange={setDepth} />
      <EffectChip label="Rays"    value={rays}    options={raysOptions}    onChange={setRays} />
      <EffectChip label="Texture" value={texture} options={textureOptions} onChange={setTexture} />

      <Separator orientation="vertical" className="mx-0.5 h-5 bg-border/60 shrink-0" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Reset all effects"
        disabled={!canReset}
        className={cn(ICON_CHIP, "disabled:opacity-30")}
        onClick={handleReset}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}

// ─── Photobook ────────────────────────────────────────────────────────────────

function PhotobookThemeSheetActions() {
  const {
    mood, texture, canReset,
    handleReset, setMood, setTexture,
    moodOptions, textureOptions,
  } = usePhotobookThemeToolbar()

  return (
    <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto no-scrollbar">

      <EffectChip label="Mood"    value={mood}    options={moodOptions}    onChange={setMood} />
      <EffectChip label="Overlay" value={texture} options={textureOptions} onChange={setTexture} />

      <Separator orientation="vertical" className="mx-0.5 h-5 bg-border/60 shrink-0" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Reset all overlays"
        disabled={!canReset}
        className={cn(ICON_CHIP, "disabled:opacity-30")}
        onClick={handleReset}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}
