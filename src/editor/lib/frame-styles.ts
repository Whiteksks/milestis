import type { FrameStyle, FrameStyleCategory } from './types'

export interface FrameStyleConfig {
  id: FrameStyle
  name: string
  description: string
  className: string
  preview: string
  category: FrameStyleCategory
}

export const frameStyles: Record<FrameStyle, FrameStyleConfig> = {
  none: {
    id: 'none',
    name: 'No Frame',
    description: 'Clean square edges with no styling',
    className: '',
    preview: 'rounded-none',
    category: 'shape'
  },
  soft: {
    id: 'soft',
    name: 'Soft Corners',
    description: 'Gentle rounded corners',
    className: 'rounded-lg',
    preview: 'rounded-lg',
    category: 'shape'
  },
  organic: {
    id: 'organic',
    name: 'Organic',
    description: 'Asymmetric rounded corners for a hand-crafted feel',
    className: 'rounded-[2rem_0.5rem_2rem_0.5rem]',
    preview: 'rounded-[2rem_0.5rem_2rem_0.5rem]',
    category: 'shape'
  },
  'border-thin': {
    id: 'border-thin',
    name: 'Thin Border',
    description: 'Minimal square outline — no rounding',
    className: 'border border-black/20',
    preview: 'border border-black/20',
    category: 'border'
  },
  'border-bold': {
    id: 'border-bold',
    name: 'Bold Frame',
    description: 'Thick white border with rounded corners and shadow',
    className: 'rounded-xl border-4 border-white shadow-lg',
    preview: 'border-4 border-white rounded-xl',
    category: 'border'
  },
  circle: {
    id: 'circle',
    name: 'Oval / Circle',
    description: 'Circle for 1:1, oval for other aspect ratios',
    className: 'rounded-full overflow-hidden',
    preview: 'rounded-full',
    category: 'shape'
  },
  'border-dark': {
    id: 'border-dark',
    name: 'Dark Border',
    description: 'Thin dark outline — sharp and minimal',
    className: 'border-2 border-black/70',
    preview: 'border-2 border-black/70',
    category: 'border'
  },
  arch: {
    id: 'arch',
    name: 'Arch',
    description: 'Rounded top arch, flat bottom — architectural portrait shape',
    className: '[border-radius:50%_50%_0_0/35%_35%_0_0] overflow-hidden',
    preview: '[border-radius:50%_50%_0_0/35%_35%_0_0]',
    category: 'shape'
  },
  newspaper: {
    id: 'newspaper',
    name: 'Newspaper',
    description: 'Double-edge outline like a print cutout',
    className: 'outline outline-2 outline-black/50 outline-offset-2',
    preview: 'outline outline-2 outline-black/50 outline-offset-2',
    category: 'border'
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    description: 'Diamond / rhombus crop via clip-path',
    className: '[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]',
    preview: '[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]',
    category: 'shape'
  }
}

export const getFrameStyle = (styleId: FrameStyle): string => {
  return frameStyles[styleId]?.className || ''
}

export const FRAME_STYLE_CATEGORIES: { id: FrameStyleCategory; label: string }[] = [
  { id: 'shape', label: 'Shape' },
  { id: 'border', label: 'Border' },
]

export const getFrameStylesByCategory = (category: FrameStyleCategory): FrameStyleConfig[] => {
  return Object.values(frameStyles).filter((s) => s.category === category)
}
