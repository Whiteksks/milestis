'use client'

import { useTranslations } from 'next-intl'
import { Check, Heart, Play } from 'lucide-react'
import { useContentSelector } from '@/editor/lib/store'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { MenuMascot } from './mascot'
import { MENU_MASCOTS } from './registry'
import { MASCOT_MOODS, MENU_MASCOT_IDS } from './types'
import { useMascot } from './use-mascot'
import { MascotPairGame } from './game/pair-game'

export function MenuMascotSettingsPanel() {
  const t = useTranslations('editor.menu.mascot')
  const { settings, update } = useContentSelector((s) => ({ settings: s.menuContent.mascot, update: s.updateMenuMascot }))
  // Demonstration never reads or modifies the guest's selection.
  const { playback, play } = useMascot(true)

  return <div className="h-full overflow-y-auto bg-card px-5 pb-8 pt-4 text-card-foreground custom-scrollbar" data-mascot-settings>
    <div className="mb-5 flex items-start gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary"><Heart className="size-4" /></div>
      <div><h3 className="text-sm font-semibold">{t('title')}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{t('hint')}</p></div>
    </div>

    <label className="mb-5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border/60 px-4 py-3">
      <span><span className="block text-sm font-medium">{t('enabled')}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t('enabledHint')}</span></span>
      <Switch checked={settings.enabled} onCheckedChange={(enabled) => update({ enabled })} aria-label={t('enabled')} />
    </label>

    <div className="overflow-hidden rounded-3xl border border-[#DFD3BE] bg-[#F7F1E5] text-[#493128]">
      <div className="flex items-center justify-between px-4 pt-4 text-[10px] font-semibold uppercase tracking-[.14em]">
        <span>{t('preview')}</span><span className="rounded-full bg-white/70 px-2.5 py-1.5 tracking-normal">{t(`moods.${playback.mood}`)}</span>
      </div>
      <div className="relative flex h-52 items-center justify-center">
        <div className="absolute size-36 rounded-full bg-[#EFE3CC]" />
        <MenuMascot settings={{ ...settings, enabled: true }} playback={playback} className="relative size-44" />
      </div>
      <div className="border-t border-[#DFD3BE] bg-white/35 px-4 py-3 text-center text-xs leading-5">{t('previewHint')}</div>
    </div>

    {settings.enabled && <div className="mt-5">
      <MascotPairGame key={settings.characterId} settings={settings} playback={playback} onReaction={play} />
    </div>}

    <fieldset className="mt-5">
      <legend className="mb-3 text-xs font-semibold">{t('tryMood')}</legend>
      <div className="flex flex-wrap gap-2">
        {MASCOT_MOODS.map((mood) => <button type="button" key={mood} onClick={() => play(mood)} aria-pressed={playback.mood === mood}
          className={cn('inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
            playback.mood === mood ? 'border-primary bg-primary/10 text-foreground' : 'border-border/60 text-muted-foreground hover:bg-muted')}>
          <Play aria-hidden="true" className="size-3" />{t(`moods.${mood}`)}
        </button>)}
      </div>
    </fieldset>

    <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 border-y border-border/60 py-4">
      <span><span className="block text-sm font-medium">{t('animations')}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t('animationsHint')}</span></span>
      <Switch checked={settings.animations} onCheckedChange={(animations) => update({ animations })} aria-label={t('animations')} />
    </label>

    <h4 className="mb-3 mt-5 text-xs font-semibold">{t('choose')}</h4>
    <div className="space-y-2">
      {MENU_MASCOT_IDS.map((id) => {
        const entry = MENU_MASCOTS[id]
        const selected = settings.characterId === id
        return <button type="button" key={id} aria-label={t(entry.nameKey)} aria-pressed={selected} onClick={() => { update({ characterId: id }); play('welcome') }}
          className={cn('flex w-full items-center gap-3 rounded-2xl border p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2', selected ? 'border-primary bg-primary/5' : 'border-border')}>
          <MenuMascot settings={{ enabled: true, characterId: id, animations: false }} playback={{ mood: 'idle', sequence: 0 }} className="size-16 shrink-0 rounded-xl bg-[#F7F1E5]" />
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{t(entry.nameKey)}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t(entry.descriptionKey)}</span></span>
          {selected && <Check aria-hidden="true" className="size-4 shrink-0 text-primary" />}
        </button>
      })}
    </div>
  </div>
}
