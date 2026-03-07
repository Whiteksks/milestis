"use client"

import * as React from "react"
import { ChevronLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { frameStyles, FRAME_STYLE_CATEGORIES, type FrameStyleConfig } from "@/editor/lib/frame-styles"
import { getFrameStyleRestrictions } from "@/editor/lib/restrictions/frame-style-restrictions"
import { aspectRatios, RATIO_LABELS } from "@/editor/lib/aspect-ratios"
import type { FrameStyle, FrameStyleCategory, AspectRatio } from "@/editor/lib/types"
import Image from "next/image"

interface InlineStylePanelProps {
  image: string
  value: FrameStyle
  aspectRatio: AspectRatio
  onChange: (value: FrameStyle) => void
  onAspectRatioChange: (value: AspectRatio) => void
  onBack: () => void
}

type Tab = FrameStyleCategory | "all"

export function InlineStylePanel({ image, value, aspectRatio, onChange, onAspectRatioChange, onBack }: InlineStylePanelProps) {
  const [tab, setTab] = React.useState<Tab>("all")

  const visibleStyles = React.useMemo(() => {
    const styles = Object.values(frameStyles)
    return tab === "all" ? styles : styles.filter((s) => s.category === tab)
  }, [tab])

  return (
    <div className="flex flex-col bg-background h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Frame Style
          </span>
          <span className="text-xs font-medium truncate">
            {frameStyles[value]?.name || "Select style"}
          </span>
        </div>
        {/* Aspect ratio switcher */}
        <div className="flex items-center gap-0.5 shrink-0">
          {(() => {
            const locked = !!getFrameStyleRestrictions(value).lockedAspectRatio
            return (Object.keys(aspectRatios) as AspectRatio[]).map((r) => (
              <Button
                key={r}
                variant="ghost"
                size="sm"
                onClick={() => onAspectRatioChange(r)}
                disabled={locked}
                className={cn(
                  "px-2 py-1 h-auto text-[11px] font-medium",
                  aspectRatio === r
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {RATIO_LABELS[r]}
              </Button>
            ))
          })()}
        </div>
      </div>

      {/* Categories */}
      <ScrollArea className="w-full whitespace-nowrap border-b bg-muted/20">
        <div className="flex p-2 gap-1">
          <ToggleGroup
            type="single"
            value={tab}
            onValueChange={(v) => { if (v) setTab(v as Tab) }}
            className="flex gap-1 flex-nowrap"
          >
            <ToggleGroupItem
              value="all"
              variant="default"
              className="px-3 py-1.5 h-auto rounded-full text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:shadow-sm data-[state=off]:text-muted-foreground"
            >
              All
            </ToggleGroupItem>
            {FRAME_STYLE_CATEGORIES.map((cat) => (
              <ToggleGroupItem
                key={cat.id}
                value={cat.id}
                variant="default"
                className="px-3 py-1.5 h-auto rounded-full text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:shadow-sm data-[state=off]:text-muted-foreground"
              >
                {cat.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {/* Grid */}
      <ScrollArea className="flex-1 h-[320px]">
        <div className="grid grid-cols-3 gap-3 p-3">
          {visibleStyles.map((style) => (
            <StyleCard
              key={style.id}
              style={style}
              image={image}
              selected={value === style.id}
              onSelect={() => onChange(style.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function StyleCard({ style, image, selected, onSelect }: { 
  style: FrameStyleConfig
  image: string
  selected: boolean
  onSelect: () => void 
}) {
  return (
    <Button
      variant="ghost"
      onClick={onSelect}
      className="group h-auto flex flex-col gap-2 p-0 rounded-none bg-transparent hover:bg-transparent focus-visible:ring-0"
    >
      <div className={cn(
        "relative aspect-square w-full transition-all duration-200",
        selected 
          ? "ring-2 ring-primary ring-offset-2" 
          : "hover:ring-2 hover:ring-muted-foreground/30 hover:ring-offset-1"
      )}>
        <div className={cn(
          "absolute inset-0 overflow-hidden",
          style.className
        )}>
          {image ? (
            <Image
              src={image}
              alt={style.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        {selected && (
          <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-lg z-10">
            <Check className="w-3 h-3" />
          </div>
        )}
      </div>

      <span className={cn(
        "text-[10px] text-center truncate w-full px-1",
        selected ? "font-bold text-foreground" : "text-muted-foreground"
      )}>
        {style.name}
      </span>
    </Button>
  )
}