// ─── Mode ───────────────────────────────────────────────────────────────────
export type AiChatMode = 'photobook' | 'portfolio' | 'menu'

// ─── Photos ─────────────────────────────────────────────────────────────────
/** Stable media-library identity. The server resolves an authorized URL from this ID;
 *  the client URL is only used by the editor's placement helpers. */
export interface AiPhotoRef {
  id: string
  url: string
}

// ─── Intent (Phase 2 will implement the classifier that produces this) ─────────
// What the user's message actually wants done this turn, decided explicitly instead of being
// inferred from keyword-matching inside one giant prompt (the old system's approach — see
// prompt.ts "write EVERY section" trigger phrases). Every branch below maps to a narrow,
// independently-callable step in the new pipeline (see core/pipeline.ts, added in a later phase).
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

// ─── AI brief (Phase 1 implements the store this describes) ───────────────────
// Persistent-per-project record of what the AI pipeline has actually decided/written, so later
// turns don't have to re-derive "is this a blank project" by diffing content against hardcoded
// sample defaults (the old system's `blankDefaults()` hack), and so a future "regenerate
// everything" can choose to skip sections the human has edited by hand since the AI last wrote
// them, instead of always overwriting.
export interface AiBriefSnapshot {
  hasGenerated: boolean
  generatedAt: number | null
  /** Section keys the AI pipeline has written content into at least once. */
  aiGeneratedSections: Record<string, true>
  /** Section keys manually edited by the user since the AI last wrote to them. */
  manuallyEditedSections: Record<string, true>
}
