import type { DepthEffect, RayEffect, TextureEffect, BackgroundLayersTheme } from '../types'

export interface BackgroundPreset {
  id: string
  name: string
  description: string
  tags: string[]
  depth: DepthEffect
  rays: RayEffect
  texture: TextureEffect
  theme: BackgroundLayersTheme
}
export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'clean',
    name: 'Clean',
    description: 'No effects — pure background color.',
    tags: ['Minimal'],
    depth: 'none', rays: 'none', texture: 'none', theme: 'dark',
  },
  {
    id: 'soft-glow',
    name: 'Soft Glow',
    description: 'Subtle radial light with fine grain texture.',
    tags: ['Minimal', 'Soft'],
    depth: 'radial-glow', rays: 'none', texture: 'grain', theme: 'dark',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Deep vignette with light shafts and film grain.',
    tags: ['Atmospheric', 'Soft'],
    depth: 'vignette', rays: 'god-rays', texture: 'grain', theme: 'light',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Northern lights atmosphere with scattered dots.',
    tags: ['Atmospheric', 'Artistic'],
    depth: 'aurora', rays: 'soft-streaks', texture: 'dots', theme: 'dark',
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    description: 'Floating ambient blobs with soft gentle streaks.',
    tags: ['Soft', 'Artistic'],
    depth: 'ambient-blobs', rays: 'soft-streaks', texture: 'grain', theme: 'dark',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Classic vignette with halftone print texture.',
    tags: ['Minimal', 'Artistic'],
    depth: 'vignette', rays: 'none', texture: 'halftone', theme: 'light',
  },
  {
    id: 'neon-grid',
    name: 'Neon Grid',
    description: 'Horizon glow with conic rays on a grid overlay.',
    tags: ['Modern', 'Atmospheric'],
    depth: 'horizon', rays: 'conic-rays', texture: 'grid', theme: 'dark',
  },
  {
    id: 'prism',
    name: 'Prism',
    description: 'Asymmetric light with a prismatic rainbow effect.',
    tags: ['Modern', 'Artistic'],
    depth: 'asymmetric-light', rays: 'prism', texture: 'dots', theme: 'light',
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'Radial glow with lens flare — clean professional look.',
    tags: ['Minimal', 'Atmospheric'],
    depth: 'radial-glow', rays: 'lens-flare', texture: 'grain', theme: 'dark',
  },
  {
    id: 'woven-light',
    name: 'Woven Light',
    description: 'Soft horizon with a woven fabric texture.',
    tags: ['Soft', 'Minimal'],
    depth: 'horizon', rays: 'none', texture: 'woven', theme: 'light',
  },
  {
    id: 'scanline',
    name: 'Scanline',
    description: 'Vignette and diagonal rays with retro scanlines.',
    tags: ['Modern', 'Artistic'],
    depth: 'vignette', rays: 'diagonal-rays', texture: 'scanlines', theme: 'light',
  },
  {
    id: 'natural',
    name: 'Natural',
    description: 'Radial glow with caustics light patterns.',
    tags: ['Soft', 'Atmospheric'],
    depth: 'radial-glow', rays: 'caustics', texture: 'grain', theme: 'light',
  },
]