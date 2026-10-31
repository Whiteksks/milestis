'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, Cookie, Gamepad2, MoveLeft, Sparkles } from 'lucide-react'
import { MenuMascot } from '@/editor/modes/menu/mascot/mascot'
import { useMascot } from '@/editor/modes/menu/mascot/use-mascot'
import { MENU_MASCOT_IDS, type MenuMascotId } from '@/editor/modes/menu/mascot/types'
import { MascotPairGame } from '@/editor/modes/menu/mascot/game/pair-game'

export function MascotStudio() {
  const t = useTranslations('restaurants')
  const mascots = useTranslations('editor.menu.mascot')
  const [characterId, setCharacter] = useState<MenuMascotId>('bun')
  const [gaming, setGaming] = useState(false)
  const { playback, play } = useMascot(true)
  const settings = { enabled: true, characterId, animations: true }
  return <div className="relative mx-auto w-full max-w-[500px]" id="meet-mascot">
    <div className="absolute -right-2 -top-5 z-10 flex size-24 rotate-12 items-center justify-center rounded-full border border-[#343d2d] bg-[#e1efad] p-3 text-center text-xs font-medium leading-4 sm:-right-5 sm:size-28">
      {t('studio.sticker')}<ArrowUpRight aria-hidden="true" className="absolute bottom-2 size-4" />
    </div>
    <div className="overflow-hidden rounded-[2rem] border border-[#d9ccba] bg-[#f2e9db] p-5 shadow-[12px_16px_0_0_#e7ddcb] sm:p-7">
      <div className="restaurant-eyebrow flex items-center gap-2 pr-20">
        <span className="size-2 rounded-full bg-[#76885a]" />{t('studio.label')}
      </div>
      {gaming ? <div className="mt-5">
        <button type="button" onClick={() => setGaming(false)} className="mb-3 flex min-h-11 items-center gap-2 text-xs font-medium"><MoveLeft className="size-4" />{t('studio.back')}</button>
        <MascotPairGame key={characterId} settings={settings} playback={playback} onReaction={play} />
      </div> : <>
        <div className="relative mt-5 flex h-64 items-center justify-center sm:h-72">
          <div className="absolute size-56 rounded-full bg-[#eec1a6] sm:size-64" />
          <span aria-hidden="true" className="absolute left-1 top-8 -rotate-12 text-4xl text-[#ac573d]">✳</span>
          <Sparkles aria-hidden="true" className="absolute bottom-9 right-2 size-7 text-[#677347]" />
          <MenuMascot settings={settings} playback={playback} className="relative size-64 sm:size-72" />
        </div>
        <div className="text-center" aria-live="polite">
          <p className="restaurant-display text-3xl">{mascots(`characters.${characterId}.name`)}</p>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#776456]">{mascots(`characters.${characterId}.description`)}</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2" aria-label={t('studio.choose')}>
          {MENU_MASCOT_IDS.map(id => <button key={id} type="button" aria-pressed={id === characterId} onClick={() => { setCharacter(id); play('welcome') }}
            className={`flex min-h-11 items-center justify-center rounded-full border px-2 text-xs font-medium transition-colors ${id === characterId ? 'border-[#35432e] bg-[#35432e] text-[#fff8e9]' : 'border-[#d5c5af] hover:bg-[#e8ddcc]'}`}>
            {mascots(`characters.${id}.name`)}
          </button>)}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#d9ccba] pt-4">
          <button type="button" onClick={() => play('happy')} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#fffaf1] px-3 text-sm font-medium hover:bg-white"><Cookie className="size-4" />{t('studio.treat')}</button>
          <button type="button" onClick={() => { setGaming(true); play('curious') }} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#bb5439] px-3 text-sm font-medium text-white hover:bg-[#a74730]"><Gamepad2 className="size-4" />{t('studio.play')}</button>
        </div>
      </>}
    </div>
    <p className="mt-7 text-center text-xs text-[#776456]">{t('studio.caption')}</p>
  </div>
}
