"use client"

import { cn } from "@/lib/utils"

interface SegmentedControlProps {
  value: string
  options: { id: string; label: string }[]
  onChange: (value: string) => void
}

export function SegmentedControl({ value, options, onChange }: SegmentedControlProps) {
  return (
    <div className="relative flex h-9 rounded-lg bg-secondary/60 border border-border/50 p-1">
      {options.map((opt) => {
        const isActive = value === opt.id
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "relative z-10 flex-1 flex items-center justify-center",
              "text-xs font-medium rounded-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-accent text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground/70"
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
