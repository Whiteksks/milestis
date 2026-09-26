import type { MenuSelectionReaction } from '../guest-selection'
import type { MascotMood, MascotPlayback } from './types'

export const MOOD_DURATION: Record<MascotMood, number> = {
  idle: 0, welcome: 1800, happy: 1400, sad: 1100, curious: 1600,
}

export function selectionMood(event: MenuSelectionReaction): MascotMood {
  return event === 'added' ? 'happy' : 'sad'
}

export type MascotAction = { type: 'play'; mood: MascotMood } | { type: 'finish'; sequence: number }

export function mascotReducer(state: MascotPlayback, action: MascotAction): MascotPlayback {
  if (action.type === 'play') return { mood: action.mood, sequence: state.sequence + 1 }
  // An earlier animation must never finish a more recent reaction.
  return action.sequence === state.sequence ? { ...state, mood: 'idle' } : state
}
