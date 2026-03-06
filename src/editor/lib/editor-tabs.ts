/**
 * Central source of truth for editor tab identifiers.
 * Import from here — never inline these unions directly in components.
 */

/** Desktop sidebar tabs */
export type DesktopEditorTab = 'sections' | 'background' | 'decorations'

/** Mobile bottom-nav tabs */
export type MobileEditorTab = 'sections' | 'background' | 'decorations' | 'design'

/** FloatingToolbar panel keys (subset of DesktopEditorTab — no 'design') */
export type FloatingToolbarTab = 'sections' | 'background' | 'decorations'
