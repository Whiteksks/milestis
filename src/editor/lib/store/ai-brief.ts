import { create } from 'zustand'

/** Tracks what the AI pipeline has actually generated for the current project, and which of
 *  those sections the human has since edited by hand — see src/lib/ai/core/types.ts
 *  `AiBriefSnapshot` for why this exists. Deliberately a separate store from ContentStore/
 *  ThemeStore (not a project-content concept, purely an AI-pipeline bookkeeping concern) and
 *  reset on project switch the same way aiChat messages are (see AiChat/index.tsx). Not yet
 *  persisted to Firestore — in-memory only until the new pipeline (later phase) actually reads
 *  it, to avoid wiring save/load for a value nothing consumes yet. */
export interface AiBriefStore {
  hasGenerated: boolean
  generatedAt: number | null
  aiGeneratedSections: Record<string, true>
  manuallyEditedSections: Record<string, true>

  /** Call after the AI pipeline writes real content into these section keys. */
  markGenerated: (sections: string[]) => void
  /** Call whenever a section is edited by the user directly (not via the AI pipeline). */
  markManuallyEdited: (section: string) => void
  reset: () => void
}

const initialState = {
  hasGenerated: false,
  generatedAt: null,
  aiGeneratedSections: {},
  manuallyEditedSections: {},
} satisfies Omit<AiBriefStore, 'markGenerated' | 'markManuallyEdited' | 'reset'>

export const useAiBriefStore = create<AiBriefStore>((set) => ({
  ...initialState,

  markGenerated: (sections) =>
    set((state) => ({
      hasGenerated: true,
      generatedAt: Date.now(),
      aiGeneratedSections: {
        ...state.aiGeneratedSections,
        ...Object.fromEntries(sections.map((s) => [s, true as const])),
      },
      // A section the AI just (re)wrote is no longer "manually edited since the AI last touched it".
      manuallyEditedSections: Object.fromEntries(
        Object.entries(state.manuallyEditedSections).filter(([key]) => !sections.includes(key)),
      ),
    })),

  markManuallyEdited: (section) =>
    set((state) => ({
      manuallyEditedSections: { ...state.manuallyEditedSections, [section]: true as const },
    })),

  reset: () => set(initialState),
}))
