import { create } from 'zustand'
import type { FrameStyle, Theme, TemplateId, ThemeCustomDecorations, DecorationAnimation, DepthEffect, RayEffect, TextureEffect, BackgroundLayersTheme, BackgroundScrollMode } from './types'

export interface ThemeCustomizations {
  decorationAnimation?: DecorationAnimation
  decorationCount?: number
  customFont?: string
  depthEffect?: DepthEffect
  raysEffect?: RayEffect
  textureEffect?: TextureEffect
  backgroundLayersTheme?: BackgroundLayersTheme
  backgroundScrollMode?: BackgroundScrollMode
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
    decorationAnimation: 'fade',
    decorationCount: 3,
    depthEffect: 'none',
    raysEffect: 'none',
    textureEffect: 'none',
    backgroundLayersTheme: 'dark',
    backgroundScrollMode: 'fixed',
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
