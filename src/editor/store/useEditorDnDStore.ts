"use client";

import { create } from "zustand";

export type EditorBlock = { id: string; component: React.ReactNode };

type EditorDnDState = {
  blocks: EditorBlock[];
  setBlocks: (blocks: EditorBlock[]) => void;
  addBlock: (block: EditorBlock) => void;
  removeBlock: (id: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  reset: () => void;
};

export const useEditorDnDStore = create<EditorDnDState>((set: any, get: any) => ({
  blocks: [],
  setBlocks: (blocks: EditorBlock[]) => set({ blocks }),
  addBlock: (block: EditorBlock) => set((state: EditorDnDState) => ({ blocks: [...state.blocks, block] })),
  removeBlock: (id: string) => set((state: EditorDnDState) => ({ blocks: state.blocks.filter((b) => b.id !== id) })),
  moveBlock: (fromIndex: number, toIndex: number) =>
    set((state: EditorDnDState) => {
      const next = [...state.blocks];
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return { blocks: state.blocks };
      next.splice(toIndex, 0, moved);
      return { blocks: next };
    }),
  reset: () => set({ blocks: [] }),
}));

export default useEditorDnDStore;
