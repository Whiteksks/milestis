"use client";

import { create } from "zustand";
import { createElement } from "react";
import type { ReactNode } from "react";
import type { BlockType } from "./useEditorStore";
import { areBlocksEqual } from "./historyMiddleware";

export type EditorBlock = { 
  id: string; 
  component: ReactNode;
  type?: BlockType;
  componentName?: string;
};

// Snapshot type for history (without React components)
type BlockSnapshot = {
  id: string;
  type?: BlockType;
  componentName?: string;
};

type EditorDnDState = {
  blocks: EditorBlock[];
  setBlocks: (blocks: EditorBlock[], saveToHistory?: boolean) => void;
  addBlock: (block: EditorBlock) => void;
  removeBlock: (id: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  reset: () => void;
  
  // History state
  past: BlockSnapshot[][];
  future: BlockSnapshot[][];
  
  // History actions
  undo: () => void;
  redo: () => void;
  saveState: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

const HISTORY_LIMIT = 50;

// Helper to create snapshot from blocks
const createSnapshot = (blocks: EditorBlock[]): BlockSnapshot[] => {
  return blocks.map(block => ({
    id: block.id,
    type: block.type,
    componentName: block.componentName,
  }));
};

// Helper to restore blocks from snapshot
// This will recreate components if they have a componentName
const restoreFromSnapshot = (snapshot: BlockSnapshot[], currentBlocks: EditorBlock[]): EditorBlock[] => {
  // Import dynamically to avoid circular dependencies
  let createBlockElement: ((name: string) => ReactNode) | null = null;
  
  return snapshot.map(snap => {
    // Try to find existing block with same id to preserve component
    const existing = currentBlocks.find(b => b.id === snap.id);
    if (existing && existing.componentName === snap.componentName) {
      return { ...existing };
    }
    
    // If block changed or doesn't exist, recreate it
    if (snap.componentName) {
      // Lazy load createBlockElement only when needed
      if (!createBlockElement) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const blockLibrary = require("@/editor/blocks/block-library");
        createBlockElement = blockLibrary.createBlockElement;
      }
      
      const component = createBlockElement ? createBlockElement(snap.componentName) : null;
      return {
        id: snap.id,
        type: snap.type,
        componentName: snap.componentName,
        component: component || createElement('div', {}, `Component not found: ${snap.componentName}`),
      } as EditorBlock;
    }
    
    // Fallback for blocks without componentName
    return {
      id: snap.id,
      type: snap.type,
      componentName: snap.componentName,
      component: existing?.component || createElement('div'),
    } as EditorBlock;
  });
};

export const useEditorDnDStore = create<EditorDnDState>((set, get) => ({
  blocks: [],
  past: [],
  future: [],
  
  setBlocks: (blocks: EditorBlock[], saveToHistory = true) => {
    if (saveToHistory) {
      const currentBlocks = get().blocks;
      const currentSnapshot = createSnapshot(currentBlocks);
      const newSnapshot = createSnapshot(blocks);
      
      // Only save if blocks changed
      if (!areBlocksEqual(currentBlocks, blocks) && currentBlocks.length > 0) {
        const { past } = get();
        const newPast = [...past, currentSnapshot];
        
        // Limit history size
        if (newPast.length > HISTORY_LIMIT) {
          newPast.shift();
        }
        
        set({ blocks, past: newPast, future: [] });
        return;
      }
    }
    set({ blocks });
  },
  
  addBlock: (block: EditorBlock) => {
    const state = get();
    const newBlocks = [...state.blocks, block];
    state.setBlocks(newBlocks, true);
  },
  
  removeBlock: (id: string) => {
    const state = get();
    const newBlocks = state.blocks.filter((b) => b.id !== id);
    state.setBlocks(newBlocks, true);
  },
  
  moveBlock: (fromIndex: number, toIndex: number) => {
    const state = get();
    const next = [...state.blocks];
    const [moved] = next.splice(fromIndex, 1);
    if (!moved) return;
    next.splice(toIndex, 0, moved);
    state.setBlocks(next, true);
  },
  
  reset: () => set({ blocks: [], past: [], future: [] }),
  
  // History actions
  saveState: () => {
    const { blocks, past } = get();
    const snapshot = createSnapshot(blocks);
    const newPast = [...past, snapshot];
    
    // Limit history size
    if (newPast.length > HISTORY_LIMIT) {
      newPast.shift();
    }
    
    set({ past: newPast, future: [] });
  },
  
  undo: () => {
    const { blocks, past, future } = get();
    if (past.length === 0) return;
    
    const previousSnapshot = past[past.length - 1];
    const newPast = past.slice(0, -1);
    const currentSnapshot = createSnapshot(blocks);
    
    // Restore blocks from snapshot
    const restoredBlocks = restoreFromSnapshot(previousSnapshot, blocks);
    
    set({
      blocks: restoredBlocks,
      past: newPast,
      future: [currentSnapshot, ...future],
    });
  },
  
  redo: () => {
    const { blocks, past, future } = get();
    if (future.length === 0) return;
    
    const nextSnapshot = future[0];
    const newFuture = future.slice(1);
    const currentSnapshot = createSnapshot(blocks);
    
    // Restore blocks from snapshot
    const restoredBlocks = restoreFromSnapshot(nextSnapshot, blocks);
    
    set({
      blocks: restoredBlocks,
      past: [...past, currentSnapshot],
      future: newFuture,
    });
  },
  
  canUndo: () => {
    return get().past.length > 0;
  },
  
  canRedo: () => {
    return get().future.length > 0;
  },
}));

export default useEditorDnDStore;
