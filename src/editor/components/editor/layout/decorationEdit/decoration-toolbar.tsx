"use client"

import type React from "react"

import { memo, useRef, useCallback, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Droplets,
  ImageIcon,
  BringToFront,
  SendToBack,
  FlipHorizontal,
  FlipVertical,
  MoreVertical,
  Trash2,
  Minus,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { DecorationElement } from "./decorationTypes"
import { clamp, round2 } from "./utils"

const MIN_SCALE = 0.5
const MAX_SCALE = 3

export interface DecorationToolbarProps {
  decoration: DecorationElement
  onUpdate: (updates: Partial<DecorationElement>) => void
  onDelete: () => void
  onImageReplace: (file: File) => void
  className?: string
}

export const DecorationToolbar = memo(function DecorationToolbar({
  decoration,
  onUpdate,
  onDelete,
  onImageReplace,
  className,
}: DecorationToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { scale = 1, opacity = 1, zIndex = 0, responsiveScale = false, transform } = decoration

  const normalizedScale = Number.isFinite(scale) ? scale : 1
  const normalizedOpacity = Number.isFinite(opacity) ? opacity : 1
  const isFront = zIndex >= 20

  const [scaleText, setScaleText] = useState(String(Math.round(normalizedScale * 100)))

  useEffect(() => {
    setScaleText(String(Math.round(normalizedScale * 100)))
  }, [normalizedScale])

  const commitScale = useCallback(() => {
    const raw = scaleText.replace(",", ".").trim()
    const percent = Number(raw)
    if (!Number.isFinite(percent)) {
      setScaleText(String(Math.round(normalizedScale * 100)))
      return
    }
    const next = clamp(percent / 100, MIN_SCALE, MAX_SCALE)
    onUpdate({ scale: round2(next) })
  }, [scaleText, normalizedScale, onUpdate])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onImageReplace(file)
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
    [onImageReplace],
  )

  const toggleFlipX = useCallback(() => {
    onUpdate({ transform: { ...transform, flipX: !transform?.flipX } })
  }, [transform, onUpdate])

  const toggleFlipY = useCallback(() => {
    onUpdate({ transform: { ...transform, flipY: !transform?.flipY } })
  }, [transform, onUpdate])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-6 left-0 z-50 flex justify-center pointer-events-none"
      style={{ right: 'var(--canvas-scrollbar-width, 0px)' }}
    >
      <div
        className={cn(
          "pointer-events-auto",
          "bg-white/95 backdrop-blur-md",
          "border border-slate-200",
          "shadow-lg shadow-slate-900/10",
          "rounded-full",
          "p-1.5",
          "flex items-center gap-0.5",
          className,
        )}
        onPointerDown={(e) => e.stopPropagation()}
      >
      {/* Flip X */}
      <Button
        type="button"
        variant="ghost"
        onClick={toggleFlipX}
        className={cn(
          "h-8 w-8 p-0 rounded-full hover:bg-slate-100",
          transform?.flipX ? "text-slate-900 bg-slate-100" : "text-slate-500",
        )}
        aria-label="Flip horizontal"
      >
        <FlipHorizontal className="h-4 w-4" />
      </Button>

      {/* Flip Y */}
      <Button
        type="button"
        variant="ghost"
        onClick={toggleFlipY}
        className={cn(
          "h-8 w-8 p-0 rounded-full hover:bg-slate-100",
          transform?.flipY ? "text-slate-900 bg-slate-100" : "text-slate-500",
        )}
        aria-label="Flip vertical"
      >
        <FlipVertical className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-4 mx-1 bg-slate-200" />

      {/* Scale controls inline */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onUpdate({ scale: round2(clamp(normalizedScale - 0.1, MIN_SCALE, MAX_SCALE)) })}
          className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Decrease scale"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium text-slate-600 tabular-nums min-w-[3ch] text-center">
          {Math.round(normalizedScale * 100)}%
        </span>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onUpdate({ scale: round2(clamp(normalizedScale + 0.1, MIN_SCALE, MAX_SCALE)) })}
          className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Increase scale"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-4 mx-1 bg-slate-200" />

      {/* Opacity */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Opacity"
          >
            <Droplets className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" side="top" sideOffset={10}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-slate-700">Opacity</Label>
              <span className="text-xs text-slate-500 tabular-nums">{Math.round(normalizedOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={normalizedOpacity}
              onChange={(e) => onUpdate({ opacity: Number.parseFloat(e.target.value) })}
              className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900"
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Layer toggle */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => onUpdate({ zIndex: isFront ? 5 : 20 })}
        className={cn(
          "h-8 w-8 p-0 rounded-full hover:bg-slate-100",
          isFront ? "text-slate-900 bg-slate-100" : "text-slate-500",
        )}
        aria-label={isFront ? "Send to back" : "Bring to front"}
      >
        {isFront ? <BringToFront className="h-4 w-4" /> : <SendToBack className="h-4 w-4" />}
      </Button>

      {/* Image replace */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => fileInputRef.current?.click()}
        className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        aria-label="Change image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <Separator orientation="vertical" className="h-4 mx-1 bg-slate-200" />

      {/* Extended menu */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label="More settings"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-72 p-3 bg-white border border-slate-200 shadow-lg rounded-xl"
          side="top"
          sideOffset={10}
        >
          <div className="space-y-3">
            {/* Scale input */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-700">Scale (exact)</Label>
              <div className="relative">
                <Input
                  value={scaleText}
                  onChange={(e) => setScaleText(e.target.value)}
                  onBlur={commitScale}
                  onKeyDown={(e) => e.key === "Enter" && commitScale()}
                  inputMode="decimal"
                  className="h-8 pr-9 text-xs border-slate-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Mobile adaptation */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
              <div>
                <div className="text-xs font-medium text-slate-700">Mobile adaptation</div>
                <div className="text-[11px] text-slate-400">Auto scale on small screens</div>
              </div>
              <Switch checked={responsiveScale} onCheckedChange={(next) => onUpdate({ responsiveScale: next })} />
            </div>

            <Separator className="bg-slate-100" />

            {/* Delete */}
            <Button
              type="button"
              variant="ghost"
              onClick={onDelete}
              className="h-8 w-full justify-start text-xs rounded-lg text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      </div>
    </motion.div>
  )
})
