import { create } from 'zustand'

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

// Simple block type
export interface Block {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface EditorState {
  activeDevice: DeviceMode
  setActiveDevice: (device: DeviceMode) => void
  selectedBlock: Block | null
  setSelectedBlock: (block: Block | null) => void
  
}

export const useEditorStore = create<EditorState>((set) => ({
  activeDevice: 'desktop',
  setActiveDevice: (device) => set({ activeDevice: device }),
  selectedBlock: null,
  setSelectedBlock: (block) => set({ selectedBlock: block }),
}))
