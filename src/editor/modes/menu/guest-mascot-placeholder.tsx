'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import { cn } from '@/lib/utils'
import type { MenuSelectionInteraction } from './guest-selection'

/** A deliberately simple browser-drawn stand-in for a future illustrated mascot. */
export function MenuGuestMascotPlaceholder({ interaction, theme }: {
  interaction: MenuSelectionInteraction | null
  theme: ThemeConfig
}) {
  const t = useTranslations('editor.menu.mascot')
  const reduceMotion = useReducedMotion()
  const mood = interaction?.kind ?? 'idle'
  const mouth = mood === 'added' ? 'M24 39 Q32 48 40 39'
    : mood === 'removed' ? 'M26 43 Q32 38 38 43'
      : 'M26 40 Q32 44 38 40'

  return <div className="mx-auto mb-5 flex max-w-2xl items-center gap-3 px-1 py-1.5">
    <motion.div
      key={interaction?.sequence ?? 0}
      initial={reduceMotion || !interaction ? false : { scale: mood === 'added' ? 0.82 : 1.08, y: mood === 'added' ? 8 : -3 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
      className="size-12 shrink-0"
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="size-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 19C17 11 24 8 32 8S47 11 47 19" fill="#FFF9EC" stroke="#8A6042" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 20H48" stroke="#8A6042" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="36" r="22" fill="#F7CF83" stroke="#8A6042" strokeWidth="2" />
        <circle cx="25" cy="33" r="2" fill="#543824" />
        <circle cx="39" cy="33" r="2" fill="#543824" />
        <path d={mouth} stroke="#543824" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {mood === 'added' && <path d="M49 21L51 17L53 21L57 23L53 25L51 29L49 25L45 23Z" fill="#E8A448" />}
      </svg>
    </motion.div>
    <div className="min-w-0" aria-live="polite" aria-atomic="true">
      <p className="text-xs font-semibold @md:text-sm">{t(`${mood}.title`)}</p>
      <p className={cn('mt-0.5 text-xs leading-5', theme.mutedText)}>{t(`${mood}.description`)}</p>
    </div>
  </div>
}
