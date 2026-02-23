"use client"

import { memo } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Droplet,
  ImageIcon,
  BringToFront,
  SendToBack,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  MoreVertical,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { DecorationElement } from "../decorationEdit/decorationTypes"
import { clamp } from "../decorationEdit/utils"
import { useDecorationToolbar } from "../../../../hooks/use-decoration-toolbar"

function OpacityIcon({ percent }: { percent: number }) {
  const clipTop = clamp(100 - percent, 0, 100)

  return (
    <span className="relative block h-4 w-4">
      <span
        className="absolute inset-0"
        style={{ clipPath: `inset(${clipTop}% 0 0 0)` }}
        aria-hidden="true"
      >
        <Droplet className="h-4 w-4" style={{ fill: "currentColor", stroke: "none" }} />
      </span>
      <Droplet className="absolute inset-0 h-4 w-4" aria-hidden="true" />
    </span>
  )
}

export interface DecorationToolbarProps {
  decorations: DecorationElement[]
  activeDecorationId: string | null
  onActiveDecorationChange: (id: string) => void

  decoration?: DecorationElement
  onUpdate?: (updates: Partial<DecorationElement>) => void
  onDelete?: () => void
  onImageReplace?: (file: File) => void

  onCloseSettings: () => void
  onOpenSettings: () => void
  onSelectDecoration?: (id: string) => void
  onLocate?: () => void // scroll to element
  className?: string
}

export const DecorationToolbar = memo(function DecorationToolbar({
  decorations,
  activeDecorationId,
  onActiveDecorationChange,
  decoration,
  onUpdate,
  onDelete,
  onImageReplace,
  onCloseSettings,
  onOpenSettings,
  onSelectDecoration,
  onLocate,
  className,
}: DecorationToolbarProps) {
  const {
    fileInputRef,
    isExpanded,
    scalePercent,
    opacityPercent,
    isFront,
    responsiveScale,
    toggleFlipX,
    toggleFlipY,
    handleFileChange,
    handleDecorationPick,
    handleScaleChange,
    handleOpacityChange,
    toggleZIndex,
    handleResponsiveScaleChange,
  } = useDecorationToolbar({
    decoration,
    onUpdate,
    onImageReplace,
    onActiveDecorationChange,
    onSelectDecoration,
  })

  const iconButtonClassName =
    "h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"

  const separatorClassName = "mx-1.5 h-4 bg-border/60"

  return (
    <div className={cn("flex p-1 gap-0", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="flex items-center gap-0"
          >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 px-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <span className="text-xs font-medium">
                      {decoration?.name || 'Select decoration'}
                    </span>
                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" sideOffset={10} className="w-64">
                  <DropdownMenuLabel className="text-xs">Decorations</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={activeDecorationId ?? ""}
                    onValueChange={(v) => v && handleDecorationPick(v)}
                  >
                    {decorations.map((d, i) => (
                      <DropdownMenuRadioItem key={d.id} value={d.id}>
                        {d.name || `Decoration ${i + 1}`}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator orientation="vertical" className={separatorClassName} />

              <Button
                type="button"
                variant="ghost"
                onClick={onOpenSettings}
                disabled={!activeDecorationId}
                className={iconButtonClassName}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="flex items-center gap-0"
          >
              {/* flip */}
              <Button
                variant="ghost"
                onClick={toggleFlipX}
                className={iconButtonClassName}
              >
                <FlipHorizontal className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={toggleFlipY}
                className={iconButtonClassName}
              >
                <FlipVertical className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className={separatorClassName} />

              {/* scale */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className={iconButtonClassName}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" sideOffset={10} className="w-64 p-4 rounded-2xl border-border/60 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-xs text-muted-foreground">Scale</Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {scalePercent}%
                    </span>
                  </div>
                  <Slider
                    value={[scalePercent]}
                    min={50}
                    max={300}
                    step={5}
                    onValueChange={([v]) => handleScaleChange(v)}
                  />
                </PopoverContent>
              </Popover>


              {/* opacity */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className={iconButtonClassName}>
                    <OpacityIcon percent={opacityPercent} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" sideOffset={10} className="w-64 p-4 rounded-2xl border-border/60 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-xs text-muted-foreground">Opacity</Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {opacityPercent}%
                    </span>
                  </div>
                  <Slider
                    value={[opacityPercent]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={([v]) => handleOpacityChange(v)}
                  />
                </PopoverContent>
              </Popover>


              <Separator orientation="vertical" className={separatorClassName} />

              {/* z */}
              <Button
                variant="ghost"
                onClick={toggleZIndex}
                className={iconButtonClassName}
              >
                {isFront ? (
                  <BringToFront className="h-4 w-4" />
                ) : (
                  <SendToBack className="h-4 w-4" />
                )}
              </Button>



              {/* image */}
              <Button
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className={iconButtonClassName}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />


              {/* more */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className={iconButtonClassName}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" sideOffset={10} className="w-68 p-4 rounded-2xl border-border/60 shadow-lg">
                  {/* Decoration Selector */}
                  <div className="mb-4">
                    <Label className="text-xs text-muted-foreground mb-2 block">Decoration</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between h-8 text-xs font-normal rounded-xl border-border/60"
                        >
                          <span>{decoration?.name || 'Select'}</span>
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-60 rounded-xl">
                        <DropdownMenuRadioGroup
                          value={activeDecorationId ?? ""}
                          onValueChange={(v) => v && handleDecorationPick(v)}
                        >
                          {decorations.map((d, i) => (
                            <DropdownMenuRadioItem key={d.id} value={d.id}>
                              {d.name || `Decoration ${i + 1}`}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Separator className="mb-4 bg-border/40" />

                  {/* Mobile Adaptation */}
                  <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                    <div>
                      <div className="text-xs font-medium text-foreground">Mobile adaptation</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Scale down on small screens
                      </div>
                    </div>
                    <Switch
                      checked={Boolean(responsiveScale)}
                      onCheckedChange={handleResponsiveScaleChange}
                    />
                  </label>

                  <Separator className="my-4 bg-border/40" />

                  {/* Actions */}
                  <div className="space-y-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl"
                      onClick={onLocate}
                      disabled={!onLocate}
                    >
                      <ChevronDown className="h-3.5 w-3.5 mr-2" />
                      Locate on canvas
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Separator orientation="vertical" className={separatorClassName} />

              <Button
                variant="ghost"
                onClick={onCloseSettings}
                className={iconButtonClassName}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})
