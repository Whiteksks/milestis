'use client'

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'

interface SectionLabelProps {
  num?: number
  label: string
  theme: ThemeConfig
  className?: string
  variant?: 'line-label-line' | 'rule-label' | 'label-only'
}

export function SectionLabel({
  num,
  label,
  theme,
  className,
  variant = 'line-label-line',
}: SectionLabelProps) {
  const text =
    num !== undefined
      ? `${String(num).padStart(2, '0')}  ·  ${label}`
      : label

  if (variant === 'label-only') {
    return (
      <span
        className={cn(
          'text-[9px] uppercase tracking-[0.4em] opacity-30',
          theme.fontBody,
          className,
        )}
      >
        {text}
      </span>
    )
  }

  if (variant === 'rule-label') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="h-px w-10 bg-current opacity-15 shrink-0" />
        <span
          className={cn(
            'text-[9px] uppercase tracking-[0.4em] opacity-30',
            theme.fontBody,
          )}
        >
          {text}
        </span>
      </div>
    )
  }

  // Default: line-label-line
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="h-px flex-1 bg-current opacity-10" />
      <span
        className={cn(
          'text-[9px] uppercase tracking-[0.4em] opacity-30 shrink-0',
          theme.fontBody,
        )}
      >
        {text}
      </span>
      <div className="h-px flex-1 bg-current opacity-10" />
    </div>
  )
}
