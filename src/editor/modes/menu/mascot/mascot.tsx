'use client'

import { useTranslations } from 'next-intl'
import { MENU_MASCOTS } from './registry'
import { useMascotMotion } from './use-mascot-motion'
import type { MascotMood, MascotPlayback, MenuMascotSettings } from './types'

export function MenuMascot({ settings, playback, className = 'size-12' }: {
  settings: MenuMascotSettings
  playback: MascotPlayback
  className?: string
}) {
  const allowMotion = useMascotMotion()
  const Character = MENU_MASCOTS[settings.characterId].component
  if (!settings.enabled) return null
  return <div aria-hidden="true" data-mascot={settings.characterId} data-mood={playback.mood} className={className}>
    <Character key={`${playback.sequence}:${settings.animations && allowMotion}`} mood={playback.mood} animated={settings.animations && allowMotion} />
  </div>
}

export function MenuMascotMessage({ mood }: { mood: MascotMood }) {
  const t = useTranslations('editor.menu.mascot')
  return <div className="min-w-0" aria-live="polite" aria-atomic="true">
    <p className="text-xs font-semibold @md:text-sm">{t(`messages.${mood}.title`)}</p>
    <p className="mt-0.5 text-xs leading-5 text-[var(--menu-muted-text)]">{t(`messages.${mood}.description`)}</p>
  </div>
}
