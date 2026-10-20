/** Editor mode identifiers shared by the registry, store and UI. */
export const EDITOR_MODES = {
  menu: 'menu',
  portfolio: 'portfolio',
  photobook: 'photobook',
  event: 'event',
} as const

export type EditorMode = (typeof EDITOR_MODES)[keyof typeof EDITOR_MODES]
