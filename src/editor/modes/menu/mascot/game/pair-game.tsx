'use client'

import { useEffect } from 'react'
import { useStore } from 'zustand'
import { useMenuGuestSession } from '../../guest-session'
import { Cherry, Cookie, IceCreamBowl, Sparkles, Heart, RotateCcw, Gamepad2, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { MenuMascot } from '../mascot'
import type { MascotMood, MascotPlayback, MenuMascotSettings } from '../types'
import { isMismatch, pairGameReducer, shuffledTreats } from './model'

const ICONS = { cherry: Cherry, cookie: Cookie, iceCream: IceCreamBowl }

/** Guest-only state: playing never changes the restaurant's saved configuration. */
export function MascotPairGame({ settings, playback, onReaction }: {
  settings: MenuMascotSettings
  playback: MascotPlayback
  onReaction: (mood: MascotMood) => void
}) {
  const t = useTranslations('editor.menu.mascot.game')
  const store = useMenuGuestSession()
  const state = useStore(store, (session) => session.game)
  const dispatch = store.getState().dispatchGame
  const started = state.deck.length > 0
  const won = started && state.matched.length === state.deck.length
  const mismatch = isMismatch(state)

  useEffect(() => {
    if (!mismatch) return
    const timer = window.setTimeout(() => dispatch({ type: 'conceal', turn: state.turn }), 1000)
    return () => window.clearTimeout(timer)
  }, [mismatch, state.turn, dispatch])

  function flip(index: number) {
    const current = store.getState().game
    const next = pairGameReducer(current, { type: 'flip', index })
    if (next === current) return
    dispatch({ type: 'flip', index })
    if (next.matched.length > current.matched.length) onReaction('happy')
    else if (isMismatch(next)) onReaction('sad')
    else onReaction('curious')
  }

  return <section className="overflow-hidden rounded-3xl border border-[#dfd3be] bg-[#fbf6eb] p-4 text-[#493128] sm:p-5" aria-label={t('title')} data-mascot-game>
    <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[.16em]">
      <span className="flex items-center gap-1.5"><Gamepad2 aria-hidden="true" className="size-4" />{t('eyebrow')}</span>
      <span className="rounded-full bg-white px-2.5 py-1.5 tracking-normal">{t('pairs', { count: state.matched.length / 2 })}</span>
    </div>
    <div className="relative mx-auto mt-3 flex h-32 items-center justify-center">
      <div className="absolute size-28 rounded-full bg-[#f2e6cc]" />
      <MenuMascot settings={settings} playback={playback} className="relative size-32" />
      <Sparkles aria-hidden="true" className="absolute right-[18%] top-5 size-5 text-[#ac743d]" />
    </div>
    <h4 className="mt-2 text-center text-lg font-semibold">{won ? t('won') : t('title')}</h4>
    <p className="mt-1 text-center text-xs leading-5 text-[#785f4d]" role="status">
      {won ? t('result', { moves: state.moves }) : mismatch ? t('tryAgain') : t('hint')}
    </p>
    <div className="mt-4 flex items-center justify-between text-xs font-medium">
      <span className="flex items-center gap-1.5"><Heart aria-hidden="true" className="size-3.5" />{t('interest')}</span><span>{state.interest}%</span>
    </div>
    <div role="progressbar" aria-label={t('interest')} aria-valuenow={state.interest} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e9deca]">
      <div className="h-full rounded-full bg-[#ae6649] motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${state.interest}%` }} />
    </div>
    {started && <div className="mt-5 grid grid-cols-3 gap-2" aria-label={t('board')}>
      {state.deck.map((treat, index) => {
        const matched = state.matched.includes(index)
        const revealed = matched || state.flipped.includes(index)
        const Icon = ICONS[treat]
        return <button key={index} type="button" aria-disabled={matched || mismatch || revealed} onClick={() => flip(index)}
          aria-label={t(matched ? 'matchedCard' : revealed ? 'revealedCard' : 'hiddenCard', { number: index + 1, treat: revealed ? t(`treats.${treat}`) : '' })}
          className={cn('relative flex aspect-square min-h-16 items-center justify-center rounded-2xl border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#493128] motion-safe:transition-colors',
            matched ? 'border-[#a7b693] bg-[#e4ecd8] text-[#526943]' : revealed ? 'border-[#ceaa7e] bg-white text-[#ae6649]' : 'border-[#e2cfac] bg-[#f0e2c8] text-[#9b7957] hover:bg-[#e9d7b7]')}>
          {revealed ? <Icon aria-hidden="true" className="size-8" /> : <span aria-hidden="true" className="font-serif text-3xl">?</span>}
          {matched && <Check aria-hidden="true" className="absolute right-2 top-2 size-3" />}
        </button>
      })}
    </div>}
    {(!started || won) && <button type="button" onClick={() => { dispatch({ type: 'start', deck: shuffledTreats() }); onReaction('curious') }}
      className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#493128] px-4 py-3 text-sm font-semibold text-[#fff8ec] hover:bg-[#644333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#493128]">
      {won ? <RotateCcw aria-hidden="true" className="size-4" /> : <Gamepad2 aria-hidden="true" className="size-4" />}{t(won ? 'again' : 'play')}
    </button>}
  </section>
}
