import { create } from 'zustand'

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

interface EditorState {
  activeDevice: DeviceMode
  setActiveDevice: (device: DeviceMode) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  activeDevice: 'desktop',
  setActiveDevice: (device) => set({ activeDevice: device }),
}))
