import { create } from 'zustand'

/** Tracks AI-generated sections and later manual edits for the open project.
 *  In-memory state is reset when the editor switches projects. */
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
