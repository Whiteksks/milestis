'use client'

import { useCallback, useEffect, useReducer, useRef } from 'react'
import type { MenuSelectionInteraction } from '../guest-selection'
import { mascotReducer, MOOD_DURATION, selectionMood } from './behavior'
import type { MascotMood } from './types'

/** One controller feeds every visible copy of a character. Preview owns its own controller. */
export function useMascot(enabled: boolean, interaction?: MenuSelectionInteraction | null) {
  const [playback, dispatch] = useReducer(mascotReducer, { mood: enabled ? 'welcome' : 'idle', sequence: 0 })
  const lastInteraction = useRef(interaction)
  const play = useCallback((mood: MascotMood) => dispatch({ type: 'play', mood }), [])

  useEffect(() => {
    play(enabled ? 'welcome' : 'idle')
  }, [enabled, play])

  useEffect(() => {
    if (lastInteraction.current === interaction) return
    lastInteraction.current = interaction
    if (enabled && interaction) play(selectionMood(interaction.kind))
  }, [enabled, interaction, play])

  useEffect(() => {
    if (playback.mood === 'idle') return
    const timer = window.setTimeout(() => dispatch({ type: 'finish', sequence: playback.sequence }), MOOD_DURATION[playback.mood])
    return () => window.clearTimeout(timer)
  }, [playback])

  return { playback, play }
}
