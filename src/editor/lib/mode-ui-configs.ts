/**
 * Per-mode UI configuration registry.
 *
 * Add one entry to MODE_UI_CONFIGS when a new EditorMode is introduced.
 * Consumers read config values instead of branching on editorMode directly,
 * keeping all UI variation centralized in one place.
 *
 * Rule of thumb:
 *  - Pure data (labels, icons, helper functions) → goes here.
 *  - React component swapping → use a REGISTRY map in the component file
 *    (see TOOLBAR_REGISTRY in theme-floating-toolbar.tsx for an example).
 */

import { Layers, WandSparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { EditorMode } from './types'
import type { ThemeCustomizations } from './store-theme'

// ─── Type ─────────────────────────────────────────────────────────────────────

export interface ModeUiConfig {
  /** Sidebar / panel header label for the backgrounds / effects section. */
  backgroundLabel: string
  /** Subtitle line shown when no effects are active. */
  backgroundHint: string
  /** Icon rendered next to the background label. */
  backgroundIcon: LucideIcon

  /** Tab label in the left sections sidebar. */
  sectionsTabLabel: string

  /** Section-title shown inside the design catalog modal. */
  backgroundCatalogTitle: string
  /** Icon for the backgrounds tab in the mobile design catalog drawer. */
  backgroundCatalogMobileIcon: LucideIcon
  /** Label for the backgrounds tab in the mobile design catalog drawer. */
  backgroundCatalogMobileLabel: string

  /** Returns the number of currently-active background effects for this mode. */
  getActiveEffectsCount: (c: Partial<ThemeCustomizations>) => number
  /**
   * Resets all background effects for this mode.
   * @param update — the `updateThemeCustomization` action from the theme store.
   */
  resetEffects: (update: (patch: Partial<ThemeCustomizations>) => void) => void
}

// ─── Per-mode configs ─────────────────────────────────────────────────────────

export const MODE_UI_CONFIGS: Record<EditorMode, ModeUiConfig> = {
  portfolio: {
    backgroundLabel: 'Background',
    backgroundHint: 'No effects applied',
    backgroundIcon: WandSparkles,

    sectionsTabLabel: 'Sections',

    backgroundCatalogTitle: 'Background Effects',
    backgroundCatalogMobileIcon: WandSparkles,
    backgroundCatalogMobileLabel: 'Background',

    getActiveEffectsCount: (c) =>
      [c.depthEffect, c.raysEffect, c.textureEffect].filter((v) => v && v !== 'none').length,

    resetEffects: (update) =>
      update({
        depthEffect: 'none',
        raysEffect: 'none',
        textureEffect: 'none',
        backgroundLayersTheme: 'dark',
        backgroundScrollMode: 'fixed',
      }),
  },

  photobook: {
    backgroundLabel: 'Mood & Texture',
    backgroundHint: 'No overlays applied',
    backgroundIcon: Layers,

    sectionsTabLabel: 'Content',

    backgroundCatalogTitle: 'Mood & Texture',
    backgroundCatalogMobileIcon: Layers,
    backgroundCatalogMobileLabel: 'Mood',

    getActiveEffectsCount: (c) =>
      [c.photobookMood, c.photobookTexture].filter((v) => v && v !== 'none').length,

    resetEffects: (update) =>
      update({ photobookMood: 'none', photobookTexture: 'none' }),
  },
}

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getModeUiConfig(mode: EditorMode): ModeUiConfig {
  return MODE_UI_CONFIGS[mode]
}
