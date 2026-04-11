'use client'

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'

interface SectionLabelProps {
  /**
   * Optional sequential number. When provided it is zero-padded to 2 digits
   * and prepended:  "02  Р’В·  Introduction"
   */
  num?: number
  label: string
  theme: ThemeConfig
  className?: string
  /**
   * Layout variant:
   *  - 'line-label-line'  РІР‚вЂќ rule Р’В· text Р’В· rule  (symmetric, lumiР“РЃre/memoir style)
   *  - 'rule-label'       РІР‚вЂќ РІвЂќР‚РІвЂќР‚РІвЂќР‚ LABEL           (left-anchored, soleil/chronicle style)
   *  - 'label-only'       РІР‚вЂќ LABEL               (bare text, no rule)
   */
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
      ? `${String(num).padStart(2, '0')}  Р’В·  ${label}`
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
