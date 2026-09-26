/**
 * Central source of truth for editor tab identifiers.
 * Import from here — never inline these unions directly in components.
 */

/** Desktop sidebar tabs */
export type DesktopEditorTab = 'sections' | 'background' | 'fonts' | 'mascot' | 'decorations'

/** Mobile bottom-nav tabs — 'appearance' merges background+decorations, 'ai' opens the AI chat modal */
export type MobileEditorTab = 'sections' | 'appearance' | 'fonts' | 'mascot' | 'design' | 'ai'

/** Shared availability for panels owned by the restaurant menu mode. */
export function isModeEditorTabAvailable(tab: DesktopEditorTab | MobileEditorTab, mode: string): boolean {
  return (tab !== 'fonts' && tab !== 'mascot') || mode === 'menu'
}

/** Sub-tabs switched between inside the mobile "appearance" tab */
export type MobileAppearanceSubTab = 'background' | 'decorations'

/** FloatingToolbar panel keys (subset of DesktopEditorTab — no 'design') */
export type FloatingToolbarTab = 'sections' | 'background' | 'decorations'
