export { MENU_MASCOT_IDS } from '../../../../../functions/src/domain/menu/mascot'
export type { MenuMascotId, MenuMascotSettings } from '../../../../../functions/src/domain/menu/mascot'

export const MASCOT_MOODS = ['idle', 'welcome', 'happy', 'sad', 'curious'] as const
export type MascotMood = (typeof MASCOT_MOODS)[number]
export interface MascotPlayback { mood: MascotMood; sequence: number }
export interface MascotCharacterProps {
  mood: MascotMood
  animated: boolean
}
