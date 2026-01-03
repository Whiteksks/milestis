"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { aspectRatios } from "@/editor/lib/aspect-ratios"
import { frameStyles } from "@/editor/lib/frame-styles"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import { ImageIcon, Plus, Settings2 } from "lucide-react"
import Image from "next/image"

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
  const current = {
    image: value.image || "",
    aspectRatio: (value.aspectRatio as AspectRatio) || "landscape",
    frameStyle: (value.frameStyle as FrameStyle) || "soft",
  }

  const update = (patch: Partial<PortfolioImagePickerValue>) => {
    onChange({ ...current, ...patch })
  }

  return (
    <div className="space-y-2.5">
      {label && (
        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
          {label}
        </Label>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Photo Area with scoped hover */}
        <div 
          onClick={onOpenMediaPicker}
          className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-slate-50"
        >
          {current.image ? (
            <>
              <Image
                src={current.image}
                alt={label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover Overlay - Only for photo */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center backdrop-blur-[2px]">
                <div className="flex items-center gap-2 rounded-lg bg-white/90 p-1.5 px-3 shadow-lg">
                  <Plus className="w-3.5 h-3.5 text-slate-900" />
                  <span className="text-[12px] font-medium text-slate-900">Change</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
              <ImageIcon className="w-6 h-6 stroke-[1.5]" />
              <span className="text-[12px] font-medium">Select Media</span>
            </div>
          )}
        </div>

        {/* Settings Bar */}
        <div className="flex items-center gap-1 p-1.5 bg-white border-t border-slate-100">
          <div className="flex flex-1 items-center gap-1">
            {/* Aspect Ratio */}
            <Select 
              value={current.aspectRatio} 
              onValueChange={(val) => update({ aspectRatio: val as AspectRatio })}
            >
              <SelectTrigger className="h-8 w-full border-none shadow-none bg-transparent hover:bg-slate-50 text-[12px] px-2 focus:ring-0">
                <SelectValue placeholder="Ratio" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(aspectRatios).map((r) => (
                  <SelectItem key={r.id} value={r.id} className="text-[12px]">{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-px h-4 bg-slate-100" />

            {/* Frame Style */}
            <Select 
              value={current.frameStyle} 
              onValueChange={(val) => update({ frameStyle: val as FrameStyle })}
            >
              <SelectTrigger className="h-8 w-full border-none shadow-none bg-transparent hover:bg-slate-50 text-[12px] px-2 focus:ring-0">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(frameStyles).map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-[12px]">{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-50"
            title="Advanced Settings"
          >
            <Settings2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}