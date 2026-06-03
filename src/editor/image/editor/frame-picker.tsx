'use client'

import { cn } from '@/lib/utils'
import { frameStyles } from '@/editor/lib/config/frame-styles'
import type { TemplateId } from '@/editor/lib/types'
import { getEffectiveImagePolicy } from '../policy/registry'
import type { ImageSlotId } from '../slots'
import type { FrameStyle } from '@/editor/lib/types'

interface FramePickerProps {
  slotId: ImageSlotId
  value: FrameStyle
  onChange: (frame: FrameStyle) => void
  templateId?: TemplateId
  className?: string
}

export function FramePicker({ slotId, value, onChange, templateId, className }: FramePickerProps) {
  const policy = getEffectiveImagePolicy(slotId, templateId)

  // Forced frame — display only, no interaction
  if (policy.frame.forced) {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium">
          Frame
        </span>
        <span className="text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded bg-muted">
          {frameStyles[policy.frame.forced]?.name ?? policy.frame.forced}
        </span>
        <span className="text-[10px] text-muted-foreground/40">fixed</span>
      </div>
    )
  }

  const options = policy.frame.allowed ?? [policy.frame.default]

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium">
        Frame
      </span>
      <div className="flex gap-1 flex-wrap">
        {options.map((frame) => {
          const config = frameStyles[frame]
          return (
            <button
              key={frame}
              onClick={() => onChange(frame)}
              title={config?.description}
              className={cn(
                'px-2.5 py-1 rounded text-[11px] font-medium transition-colors',
                value === frame
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80',
              )}
            >
              {config?.name ?? frame}
            </button>
          )
        })}
      </div>
    </div>
  )
}
