"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { aspectRatios } from "@/editor/lib/aspect-ratios"
import { frameStyles } from "@/editor/lib/frame-styles"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import { ImageIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PortfolioImagePickerValue {
  image: string
  aspectRatio?: AspectRatio
  frameStyle?: FrameStyle
}

interface PortfolioImagePickerProps {
  label?: string
  value: PortfolioImagePickerValue
  onChange: (value: PortfolioImagePickerValue) => void
  onOpenMediaPicker?: () => void
}

export function PortfolioImagePicker({
  label = "Image",
  value,
  onChange,
  onOpenMediaPicker,
}: PortfolioImagePickerProps) {
  const current: PortfolioImagePickerValue = {
    image: value.image || "",
    aspectRatio: (value.aspectRatio as AspectRatio) || "landscape",
    frameStyle: (value.frameStyle as FrameStyle) || "soft",
  }

  const update = (patch: Partial<PortfolioImagePickerValue>) => {
    onChange({ ...current, ...patch })
  }

  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {label && (
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
            {label}
          </Label>
        )}

        {/* Preview area */}
        <div
          onClick={onOpenMediaPicker}
          className={cn(
            "group relative aspect-video w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 transition-all hover:bg-slate-100 hover:border-slate-300 cursor-pointer overflow-hidden flex items-center justify-center",
            current.image && "border-none bg-white shadow-sm ring-1 ring-slate-100"
          )}
        >
          {current.image ? (
            <>
              <img
                src={current.image}
                alt={label}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-xl shadow-sm bg-white text-slate-900 hover:bg-slate-50 h-8 text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Change
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <div className="p-3 rounded-full bg-white shadow-sm border border-slate-100">
                <ImageIcon className="w-5 h-5 text-slate-300" />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wide">Select Photo</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {/* Image URL */}
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
            Direct Link
          </Label>
          <Input
            placeholder="https://..."
            value={current.image}
            onChange={(e) => update({ image: e.target.value })}
            className={inputStyle}
          />
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
              Aspect Ratio
            </Label>
            <Select
              value={(current.aspectRatio as AspectRatio) || "landscape"}
              onValueChange={(val) => update({ aspectRatio: val as AspectRatio })}
            >
              <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white hover:border-slate-300 text-xs shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(aspectRatios).map((ratio) => (
                  <SelectItem key={ratio.id} value={ratio.id}>
                    {ratio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
              Frame Style
            </Label>
            <Select
              value={(current.frameStyle as FrameStyle) || "soft"}
              onValueChange={(val) => update({ frameStyle: val as FrameStyle })}
            >
              <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white hover:border-slate-300 text-xs shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(frameStyles).map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioImagePicker
