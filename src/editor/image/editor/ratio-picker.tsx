'use client'

import { cn } from '@/lib/utils'
import type { TemplateId } from '@/editor/lib/types'
import { getEffectiveImagePolicy } from '../policy/registry'
import type { ImageSlotId } from '../slots'
import type { ImageRatioValue } from '../data'

function ratioLabel(ratio: ImageRatioValue): string {
  const labels: Record<string, string> = {
    square: '1:1',
    portrait: '4:5',
    poster: '2:3',
    wide: '16:9',
    cinematic: '21:9',
    '4/5': '4:5',
  }
  return labels[ratio] ?? ratio.replace('/', ':')
}

interface RatioPickerProps {
  slotId: ImageSlotId
  value: ImageRatioValue
  onChange: (ratio: ImageRatioValue) => void
  templateId?: TemplateId
  className?: string
}

export function RatioPicker({ slotId, value, onChange, templateId, className }: RatioPickerProps) {
  const policy = getEffectiveImagePolicy(slotId, templateId)

  // Forced ratio — display only, no interaction
  if (policy.ratio.forced) {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium">
          Ratio
        </span>
        <span className="text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded bg-muted">
          {ratioLabel(policy.ratio.forced)}
        </span>
        <span className="text-[10px] text-muted-foreground/40">fixed</span>
      </div>
    )
  }

  const options = policy.ratio.allowed ?? [policy.ratio.default]

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium">
        Ratio
      </span>
      <div className="flex gap-1 flex-wrap">
        {options.map((ratio) => (
          <button
            key={ratio}
            onClick={() => onChange(ratio)}
            className={cn(
              'px-2.5 py-1 rounded text-[11px] font-medium transition-colors',
              value === ratio
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80',
            )}
          >
            {ratioLabel(ratio)}
          </button>
        ))}
      </div>
    </div>
  )
}
