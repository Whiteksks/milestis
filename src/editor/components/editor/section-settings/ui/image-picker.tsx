"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { aspectRatios } from "@/editor/lib/aspect-ratios"
import { frameStyles } from "@/editor/lib/frame-styles"
import type { AspectRatio, FrameStyle, PhotoBlock } from "@/editor/lib/types"
import { ImageIcon, Plus, Settings2 } from "lucide-react"
import { useId } from "react"
import Image from "next/image"

export interface ImagePickerValue extends PhotoBlock {}

interface ImagePickerProps {
  value?: ImagePickerValue
  onChange: (next: ImagePickerValue) => void
  label?: string
  showCaption?: boolean
  onOpenMediaPicker?: () => void
}

export function ImagePicker({
  value,
  onChange,
  label = "Image",
  showCaption = true,
  onOpenMediaPicker,
}: ImagePickerProps) {
  const autoId = useId()
  
  // Приводим данные к нужному формату PhotoBlock
  const current: ImagePickerValue = value ?? {
    id: `image-${autoId}`,
    image: "",
    caption: "",
    imageSettings: [{ aspectRatio: "landscape", frameStyle: "soft" }],
  }

  const firstSettings = current.imageSettings[0] ?? { aspectRatio: "landscape", frameStyle: "soft" }
  
  const update = (patch: Partial<ImagePickerValue>) => onChange({ ...current, ...patch })
  
  const updateSettings = (patch: Partial<{ aspectRatio: AspectRatio; frameStyle: FrameStyle }>) => {
    update({ imageSettings: [{ ...firstSettings, ...patch }] })
  }

  return (
    <div className="space-y-2.5">
      {label && (
        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
          {label}
        </Label>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Photo Area */}
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

        {/* Settings Bar - Идентичный твоему запросу */}
        <div className="flex items-center gap-1 p-1.5 bg-white border-t border-slate-100">
          <div className="flex flex-1 items-center gap-1">
            <Select 
              value={(firstSettings.aspectRatio as AspectRatio) || "landscape"} 
              onValueChange={(val) => updateSettings({ aspectRatio: val as AspectRatio })}
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

            <Select 
              value={(firstSettings.frameStyle as FrameStyle) || "soft"} 
              onValueChange={(val) => updateSettings({ frameStyle: val as FrameStyle })}
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

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-50"
            type="button"
          >
            <Settings2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Caption Section - Минималистично под блоком */}
      {showCaption && (
        <div className="px-1">
         <Input
            value={current.caption || ""}
            onChange={(e) => update({ caption: e.target.value })}
            placeholder="Add caption..."
            className="h-7 border-b border-t-0 border-x-0 rounded-none bg-transparent text-[12px] italic text-slate-500 focus-visible:ring-0 px-0 placeholder:text-slate-300 shadow-none"
          />
        </div>
      )}
    </div>
  )
}