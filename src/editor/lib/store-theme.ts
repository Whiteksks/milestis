import { create } from 'zustand'
import type { FrameStyle, Theme, TemplateId, ThemeCustomDecorations, BackgroundImageType, DecorationAnimation } from './types'

export interface ThemeCustomizations {
  backgroundImageOpacity?: number
  backgroundImageType?: BackgroundImageType
  decorationAnimation?: DecorationAnimation
  decorationCount?: number
  customFont?: string
  customBackground?: string
}

export interface ThemeStore {
  currentTemplateId: TemplateId
  currentTheme: Theme
  frameStyle: FrameStyle
  themeCustomizations: ThemeCustomizations
  customDecorations: ThemeCustomDecorations[]

  setTemplate: (templateId: TemplateId) => void
  setTheme: (theme: Theme) => void
  setFrameStyle: (style: FrameStyle) => void
  updateThemeCustomization: (
    customizations: Partial<ThemeCustomizations>,
  ) => void
  addDecoration: (decoration: ThemeCustomDecorations) => void
  updateDecoration: (id: string, updates: Partial<ThemeCustomDecorations>) => void
  removeDecoration: (id: string) => void
  resetDecorations: () => void
  setDecorations: (decorations: ThemeCustomDecorations[]) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  currentTemplateId: 'classic',
  currentTheme: 'vellum-vintage',
  frameStyle: 'soft',
  themeCustomizations: {
    backgroundImageOpacity: 0.15,
    backgroundImageType: 'fixed',
    decorationAnimation: 'fade',
    decorationCount: 3,
  },
  customDecorations: [],

  setTemplate: (templateId) => set({ currentTemplateId: templateId }),

  setTheme: (theme) => set({ currentTheme: theme }),

  setFrameStyle: (style) => set({ frameStyle: style }),

  updateThemeCustomization: (customizations) =>
    set((state) => ({
      themeCustomizations: {
        ...state.themeCustomizations,
        ...customizations,
      },
    })),

  addDecoration: (decoration) =>
    set((state) => ({
      customDecorations: [...state.customDecorations, decoration],
    })),

  updateDecoration: (id, updates) =>
    set((state) => ({
      customDecorations: state.customDecorations.map((dec) =>
        dec.id === id ? { ...dec, ...updates } : dec,
      ),
    })),

  removeDecoration: (id) =>
    set((state) => ({
      customDecorations: state.customDecorations.filter((dec) => dec.id !== id),
    })),

  resetDecorations: () => set({ customDecorations: [] }),

  setDecorations: (decorations) => set({ customDecorations: decorations }),
}))
