"use client"

import type React from "react"
import { memo, useRef, useCallback, useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
import type { DecorationElement } from "./decorationTypes"
import { clamp, round2 } from "./utils"

const MIN_SCALE = 0.5
const MAX_SCALE = 3

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
  /* ---------------------------------- refs --------------------------------- */

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ---------------------------------- state -------------------------------- */

  const isExpanded = Boolean(decoration)

  const {
    scale = 1,
    opacity = 1,
    zIndex = 0,
    responsiveScale = false,
    transform,
  } = decoration ?? {}

  const normalizedScale = Number.isFinite(scale) ? scale : 1
  const normalizedOpacity = Number.isFinite(opacity) ? opacity : 1
  const scalePercent = Math.round(clamp(normalizedScale, MIN_SCALE, MAX_SCALE) * 100)
  const opacityPercent = Math.round(clamp(normalizedOpacity, 0, 1) * 100)
  const isFront = zIndex >= 20

  const [scaleText, setScaleText] = useState("100")

  useEffect(() => {
    setScaleText(String(Math.round(normalizedScale * 100)))
  }, [normalizedScale])

  /* ------------------------------- callbacks -------------------------------- */

  const commitScale = useCallback(() => {
    const raw = scaleText.replace(",", ".").trim()
    const percent = Number(raw)
    if (!Number.isFinite(percent)) {
      setScaleText(String(Math.round(normalizedScale * 100)))
      return
    }

    onUpdate?.({
      scale: round2(clamp(percent / 100, MIN_SCALE, MAX_SCALE)),
    })
  }, [scaleText, normalizedScale, onUpdate])

  const toggleFlipX = useCallback(() => {
    onUpdate?.({ transform: { ...transform, flipX: !transform?.flipX } })
  }, [transform, onUpdate])

  const toggleFlipY = useCallback(() => {
    onUpdate?.({ transform: { ...transform, flipY: !transform?.flipY } })
  }, [transform, onUpdate])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onImageReplace?.(file)
      e.currentTarget.value = ""
    },
    [onImageReplace],
  )

  const handleDecorationPick = useCallback(
    (id: string) => {
      onActiveDecorationChange(id)
      onSelectDecoration?.(id)
    },
    [onActiveDecorationChange, onSelectDecoration],
  )

  /* ---------------------------------- view --------------------------------- */

  const iconButtonClassName =
    "h-8 w-8 p-0 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100"

  const separatorClassName = "mx-1 opacity-80"

  const OpacityIcon = ({ percent }: { percent: number }) => {
    const clipTop = clamp(100 - percent, 0, 100)

    return (
      <span className="relative block h-4 w-4">
        <span
          className="absolute inset-0"
          style={{ clipPath: `inset(${clipTop}% 0 0 0)` }}
          aria-hidden="true"
        >
          <Droplet
            className="h-4 w-4"
            style={{ fill: "currentColor", stroke: "none" }}
          />
        </span>
        <Droplet className="absolute inset-0 h-4 w-4" aria-hidden="true" />
      </span>
    )
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="fixed bottom-1 md:bottom-2 left-0 z-50 flex justify-center pointer-events-none"
      style={{ right: "var(--canvas-scrollbar-width, 0px)" }}
    >
      <motion.div
        layout
        className={cn(
          "pointer-events-auto",
          "bg-white/45 backdrop-blur-sm",
          "border border-slate-200",
          "shadow-lg shadow-slate-900/10",
          "rounded-full",
          "p-1.5",
          "flex gap-0",
          className,
        )}
        onPointerDown={(e) => e.stopPropagation()}
      >
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
                    className="h-8 px-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <span className="text-xs font-medium">Выберите декорацию</span>
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
                        Decoration {i + 1}
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
                <PopoverContent side="top" sideOffset={10} className="w-72 p-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Размер</Label>
                    <span className="text-xs tabular-nums text-slate-600">
                      {scalePercent}%
                    </span>
                  </div>

                  <div className="mt-2">
                    <Slider
                      value={[scalePercent]}
                      min={50}
                      max={300}
                      step={5}
                      onValueChange={([v]) =>
                        onUpdate?.({
                          scale: round2(clamp(v / 100, MIN_SCALE, MAX_SCALE)),
                        })
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>


              {/* opacity */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className={iconButtonClassName}>
                    <OpacityIcon percent={opacityPercent} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" sideOffset={10} className="w-72 p-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Opacity</Label>
                    <span className="text-xs tabular-nums text-slate-600">
                      {opacityPercent}%
                    </span>
                  </div>

                  <div className="mt-2">
                    <Slider
                      value={[opacityPercent]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={([v]) =>
                        onUpdate?.({ opacity: round2(clamp(v / 100, 0, 1)) })
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>


              <Separator orientation="vertical" className={separatorClassName} />

              {/* z */}
              <Button
                variant="ghost"
                onClick={() => onUpdate?.({ zIndex: isFront ? 5 : 20 })}
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
                <PopoverContent side="top" sideOffset={10} className="w-80 p-4">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      Настройки
                    </div>
                    <div className="text-xs text-slate-500">
                      Дополнительные параметры декорации
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div>
                    <Label className="text-xs">Scale (%)</Label>
                    <Input
                      className="mt-1"
                      inputMode="decimal"
                      value={scaleText}
                      onChange={(e) => setScaleText(e.target.value)}
                      onBlur={commitScale}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitScale()
                        if (e.key === "Escape") {
                          setScaleText(String(Math.round(normalizedScale * 100)))
                        }
                      }}
                    />
                    <div className="mt-1 text-xs text-slate-500">
                      Введите значение в % и нажмите Enter
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-slate-900">
                        Адаптация для мобильных
                      </div>
                      <div className="text-xs text-slate-500">
                        Автоматически подстраивает размер декорации на маленьких
                        экранах
                      </div>
                    </div>
                    <Switch
                      checked={Boolean(responsiveScale)}
                      onCheckedChange={(v) => onUpdate?.({ responsiveScale: v })}
                    />
                  </div>

                  <Separator className="my-3" />

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-600 hover:text-blue-700"
                      onClick={onLocate}
                      disabled={!onLocate}
                    >
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Найти на холсте
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить
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
      </motion.div>
    </motion.div>
  )
})
