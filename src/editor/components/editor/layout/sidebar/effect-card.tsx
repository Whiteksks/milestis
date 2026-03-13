"use client"

import { cn } from "@/lib/utils"

interface EffectOption {
  id: string
  label: string
  description?: string
}

interface EffectCardProps {
  label: string
  description?: string
  value: string
  options: EffectOption[]
  onChange: (value: string) => void
  columns?: 2 | 3 | 4 | 5
}

const COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
}

export function EffectCard({ label, description, value, options, onChange, columns = 3 }: EffectCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2.5 px-1">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-foreground/80 tracking-wide">
            {label}
          </span>
          {description && (
            <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
        {value !== "none" && (
          <span className="shrink-0 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {options.find(o => o.id === value)?.label}
          </span>
        )}
      </div>

      <div className={cn('grid gap-1.5', COLS[columns])}>
        {options.map((opt) => {
          const isActive = value === opt.id
          const isNone = opt.id === "none"

          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              title={opt.description}
              className={cn(
                "relative h-9 rounded-xs text-[11px] font-medium tracking-wide",
                "transition-all duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_12px_-4px] shadow-primary/20"
                  : "bg-secondary/60 text-muted-foreground border border-transparent hover:bg-accent hover:text-foreground/80",
                isNone && !isActive && "text-muted-foreground/60"
              )}
            >
              <span className="relative z-10 capitalize">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
