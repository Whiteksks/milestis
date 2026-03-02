"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  frameStyles,
  FRAME_STYLE_CATEGORIES,
  type FrameStyleConfig,
} from "@/editor/lib/frame-styles"
import type { FrameStyle, FrameStyleCategory } from "@/editor/lib/types"
import { ChevronLeft, Check } from "lucide-react"

interface InlineStylePanelProps {
  image: string
  value: FrameStyle
  onChange: (value: FrameStyle) => void
  onBack: () => void
}

/** Active tab — null means "All" */
type Tab = FrameStyleCategory | null

export function InlineStylePanel({ image, value, onChange, onBack }: InlineStylePanelProps) {
  const [tab, setTab] = useState<Tab>(null)

  const visibleStyles =
    tab === null
      ? Object.values(frameStyles)
      : Object.values(frameStyles).filter((s) => s.category === tab)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-xs font-medium text-foreground flex-1">Frame Style</span>
        <span className="text-xs text-muted-foreground">{frameStyles[value]?.name}</span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-0.5 px-2 pt-2 pb-1 overflow-x-auto no-scrollbar">
        <TabButton active={tab === null} onClick={() => setTab(null)}>All</TabButton>
        {FRAME_STYLE_CATEGORIES.map((cat) => (
          <TabButton key={cat.id} active={tab === cat.id} onClick={() => setTab(cat.id)}>
            {cat.label}
          </TabButton>
        ))}
      </div>

      {/* Style grid */}
      <div className="grid grid-cols-3 gap-2 p-2 overflow-y-auto max-h-56">
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
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors shrink-0",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {children}
    </button>
  )
}

function StyleCard({
  style,
  image,
  selected,
  onSelect,
}: {
  style: FrameStyleConfig
  image: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      title={style.description}
      className={cn(
        "relative flex flex-col items-center gap-1 p-1 rounded-lg transition-colors group",
        selected ? "bg-primary/10 ring-1 ring-primary" : "hover:bg-muted/60"
      )}
    >
      {/* Photo preview with style applied */}
      <div className="w-full aspect-square overflow-hidden rounded-md bg-muted/30 flex items-center justify-center p-1">
        <div className={cn("w-full h-full overflow-hidden", style.className)}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={style.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/40" />
          )}
        </div>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-primary-foreground" />
        </div>
      )}

      <span className="text-[10px] leading-tight text-center text-muted-foreground line-clamp-1 w-full px-0.5">
        {style.name}
      </span>
    </button>
  )
}
