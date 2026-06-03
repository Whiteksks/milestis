import type { FrameStyle, FrameStyleCategory } from '../types'

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
  squircle: {
    id: 'squircle',
    name: 'Squircle',
    description: 'iOS-style smooth rounded square',
    className: 'rounded-[30%] overflow-hidden',
    preview: 'rounded-[30%]',
    category: 'shape'
  },
  organic: {
    id: 'organic',
    name: 'Organic',
    description: 'Asymmetric rounded corners — large top-left and bottom-right',
    className: 'rounded-[2rem_0.5rem_2rem_0.5rem]',
    preview: 'rounded-[2rem_0.5rem_2rem_0.5rem]',
    category: 'shape'
  },
  'organic-b': {
    id: 'organic-b',
    name: 'Organic B',
    description: 'Three large corners, one small notch at bottom-right',
    className: 'rounded-[2rem_2rem_0.5rem_2rem]',
    preview: 'rounded-[2rem_2rem_0.5rem_2rem]',
    category: 'shape'
  },
  arch: {
    id: 'arch',
    name: 'Arch',
    description: 'Rounded top arch, flat bottom — architectural portrait shape',
    className: '[border-radius:50%_50%_0_0/35%_35%_0_0] overflow-hidden',
    preview: '[border-radius:50%_50%_0_0/35%_35%_0_0]',
    category: 'shape'
  },
  circle: {
    id: 'circle',
    name: 'Oval / Circle',
    description: 'Circle for 1:1, oval for other aspect ratios',
    className: 'rounded-full overflow-hidden',
    preview: 'rounded-full',
    category: 'shape'
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    description: 'Diamond / rhombus crop via clip-path',
    className: '[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]',
    preview: '[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]',
    category: 'shape'
  },
  'border-bold': {
    id: 'border-bold',
    name: 'Bold Frame',
    description: 'Thick white border with rounded corners and shadow',
    className: 'rounded-xl border-4 border-white shadow-lg',
    preview: 'border-4 border-white rounded-xl',
    category: 'border'
  },
  passepartout: {
    id: 'passepartout',
    name: 'Passe-Partout',
    description: 'Museum mat frame — white inner field, thin outer border',
    className: 'border-[12px] border-white shadow-[0_0_0_1.5px_rgba(0,0,0,0.25)]',
    preview: 'border-4 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]',
    category: 'border'
  },
  'border-dark': {
    id: 'border-dark',
    name: 'Dark Border',
    description: 'Thin dark outline — sharp and minimal',
    className: 'border-2 border-black/70',
    preview: 'border-2 border-black/70',
    category: 'border'
  },
  newspaper: {
    id: 'newspaper',
    name: 'Newspaper',
    description: 'Double-edge outline like a print cutout',
    className: 'outline outline-2 outline-black/50 outline-offset-2',
    preview: 'outline outline-2 outline-black/50 outline-offset-2',
    category: 'border'
  },
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
