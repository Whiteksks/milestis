/**
 * Single source of truth for valid editor mode identifiers.
 * No dependencies — safe to import from anywhere without circular refs.
 *
 * To add a new mode:
 *  1. Add the id here (e.g.  scrapbook: 'scrapbook')
 *  2. Create src/editor/modes/<name>/ folder with the required files
 *  3. Register in lib/modes/registry.ts → ALL_MODES
 *  4. Add slice to lib/store-content.ts → ALL_SLICE_CREATORS
 *
 * The compile-time check in registry.ts will fail if you forget step 1 or 3.
 */
export const EDITOR_MODES = {
  portfolio: 'portfolio',
  photobook: 'photobook',
} as const

export type EditorMode = (typeof EDITOR_MODES)[keyof typeof EDITOR_MODES]
