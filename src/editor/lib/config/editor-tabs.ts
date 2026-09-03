/**
 * Central source of truth for editor tab identifiers.
 * Import from here — never inline these unions directly in components.
 */

/** Desktop sidebar tabs */
export type DesktopEditorTab = 'sections' | 'background' | 'decorations'

/** Mobile bottom-nav tabs — 'appearance' merges background+decorations, 'ai' opens the AI chat modal */
export type MobileEditorTab = 'sections' | 'appearance' | 'design' | 'ai'

/** Sub-tabs switched between inside the mobile "appearance" tab */
export type MobileAppearanceSubTab = 'background' | 'decorations'

/** FloatingToolbar panel keys (subset of DesktopEditorTab — no 'design') */
export type FloatingToolbarTab = 'sections' | 'background' | 'decorations'
