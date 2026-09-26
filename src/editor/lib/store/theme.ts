import { create } from 'zustand'
import type { Theme, TemplateId, ThemeCustomDecorations, DecorationAnimation, DepthEffect, RayEffect, TextureEffect, BackgroundLayersTheme, BackgroundScrollMode, PhotobookTexture, PhotobookMood } from '../types'

export type MenuFontPair = 'signature' | 'editorial' | 'modern' | 'lora' | 'onest'

export interface ThemeCustomizations {
  decorationAnimation?: DecorationAnimation
  customFont?: string
  depthEffect?: DepthEffect
  raysEffect?: RayEffect
  textureEffect?: TextureEffect
  backgroundLayersTheme?: BackgroundLayersTheme
  backgroundScrollMode?: BackgroundScrollMode
  /** Photobook-only: paper/texture overlay */
  photobookTexture?: PhotobookTexture
  /** Photobook-only: colour mood filter */
  photobookMood?: PhotobookMood
  menuFontPair?: MenuFontPair
}

export interface ThemeStore {
  currentTemplateId: TemplateId
  currentTheme: Theme
  themeCustomizations: ThemeCustomizations
  customDecorations: ThemeCustomDecorations[]

  setTemplate: (templateId: TemplateId) => void
  setTheme: (theme: Theme) => void
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
  currentTemplateId: 'editorial',
  currentTheme: 'parchment',
  themeCustomizations: {
    decorationAnimation: 'fade',
    depthEffect: 'none',
    raysEffect: 'none',
    textureEffect: 'none',
    backgroundLayersTheme: 'dark',
    backgroundScrollMode: 'fixed',
    photobookTexture: 'none',
    photobookMood: 'none',
    menuFontPair: 'signature',
  },
  customDecorations: [],

  setTemplate: (templateId) => set({ currentTemplateId: templateId }),

  setTheme: (theme) => set({ currentTheme: theme }),

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
