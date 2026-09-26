import type { ComponentType } from 'react'
import type { MascotCharacterProps, MenuMascotId } from './types'
import { BunCharacter } from './characters/bun/character'
import { MochiCharacter } from './characters/mochi/character'
import { PepperCharacter } from './characters/pepper/character'

export const MENU_MASCOTS: Record<MenuMascotId, { component: ComponentType<MascotCharacterProps>; nameKey: string; descriptionKey: string }> = {
  bun: { component: BunCharacter, nameKey: 'characters.bun.name', descriptionKey: 'characters.bun.description' },
  mochi: { component: MochiCharacter, nameKey: 'characters.mochi.name', descriptionKey: 'characters.mochi.description' },
  pepper: { component: PepperCharacter, nameKey: 'characters.pepper.name', descriptionKey: 'characters.pepper.description' },
}
