import { ContentValidationError, readBoolean, readRecord } from '../validation';

export const MENU_MASCOT_IDS = ['bun', 'mochi', 'pepper'] as const;
export type MenuMascotId = (typeof MENU_MASCOT_IDS)[number];
export interface MenuMascotSettings {
  enabled: boolean;
  characterId: MenuMascotId;
  animations: boolean;
}

export function createMenuMascotSettings(): MenuMascotSettings {
  return { enabled: true, characterId: 'bun', animations: true };
}

export function readMenuMascotSettings(value: unknown): MenuMascotSettings {
  if (value === undefined) return createMenuMascotSettings();
  const raw = readRecord(value, 'mascot');
  if (!MENU_MASCOT_IDS.includes(raw.characterId as MenuMascotId)) throw new ContentValidationError('mascot.characterId');
  return {
    characterId: raw.characterId as MenuMascotId,
    enabled: readBoolean(raw.enabled, 'mascot.enabled'),
    animations: readBoolean(raw.animations, 'mascot.animations'),
  };
}
