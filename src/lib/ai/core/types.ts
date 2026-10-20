export type AiChatMode = 'photobook' | 'portfolio' | 'menu'

/** Stable media-library identity. The server resolves an authorized URL from this ID;
 *  the client URL is only used by the editor's placement helpers. */
export interface AiPhotoRef {
  id: string
  url: string
}

/** The classifier selects a pipeline action before any changes are applied. */
export type AiIntentKind =
  | 'generate_all' // (re)decide style + (re)write every section from scratch
  | 'edit_section' // touch only the section(s) named in `sections`, nothing else
  | 'edit_theme'   // touch only template/palette/mood/effects, no copy
  | 'chat'         // question / clarification — no changes at all

export interface AiIntent {
  kind: AiIntentKind
  /** Only meaningful for 'edit_section' — which section key(s) are in scope this turn.
   *  Keys are mode-specific section names (photobook: cover/introduction/story/gallery/
   *  highlight/ending; portfolio: header/hero/bio/featuredWork/contact/footer). */
  sections?: string[]
}
