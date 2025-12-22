import type { FrameStyle } from './types'

export interface FrameStyleConfig {
  id: FrameStyle
  name: string
  description: string
  className: string
  preview: string
}

export const frameStyles: Record<FrameStyle, FrameStyleConfig> = {
  none: {
    id: 'none',
    name: 'No Frame',
    description: 'Clean edges with no styling',
    className: '',
    preview: 'rounded-none'
  },
  soft: {
    id: 'soft',
    name: 'Soft Corners',
    description: 'Gentle rounded corners',
    className: 'rounded-lg',
    preview: 'rounded-lg'
  },
  organic: {
    id: 'organic',
    name: 'Organic',
    description: 'Asymmetric rounded corners',
    className: 'rounded-[2rem_0.5rem_2rem_0.5rem]',
    preview: 'rounded-[2rem_0.5rem_2rem_0.5rem]'
  },
  polaroid: {
    id: 'polaroid',
    name: 'Polaroid',
    description: 'Classic instant photo style',
    className: 'rounded-sm p-2 bg-white shadow-lg',
    preview: 'rounded-sm'
  },
  gallery: {
    id: 'gallery',
    name: 'Gallery Frame',
    description: 'Museum-style white frame',
    className: 'border-8 border-white shadow-xl',
    preview: 'border-4 border-white'
  },
  film: {
    id: 'film',
    name: 'Film Strip',
    description: '35mm film aesthetic',
    className: 'border-x-4 border-black shadow-md',
    preview: 'border-x-2 border-black'
  },
  'shadow-soft': {
    id: 'shadow-soft',
    name: 'Soft Shadow',
    description: 'Subtle depth with a gentle shadow',
    className: 'rounded-lg shadow-md shadow-black/20',
    preview: 'shadow-md'
  },
  'shadow-strong': {
    id: 'shadow-strong',
    name: 'Deep Shadow',
    description: 'Dramatic card-like elevation',
    className: 'rounded-xl shadow-2xl shadow-black/40',
    preview: 'shadow-2xl'
  },
  'border-thin': {
    id: 'border-thin',
    name: 'Thin Border',
    description: 'Minimal 1px outline',
    className: 'rounded-lg border border-black/10',
    preview: 'border'
  },
  'border-bold': {
    id: 'border-bold',
    name: 'Bold Frame',
    description: 'Strong photographic border',
    className: 'rounded-xl border-4 border-white shadow-lg bg-black/5',
    preview: 'border-4'
  },
  'rounded-xl': {
    id: 'rounded-xl',
    name: 'Extra Round',
    description: 'Larger radius corners',
    className: 'rounded-3xl',
    preview: 'rounded-3xl'
  },
  circle: {
    id: 'circle',
    name: 'Circle',
    description: 'Perfect circular crop (best for 1:1)',
    className: 'rounded-full aspect-square object-cover',
    preview: 'rounded-full'
  }
}

export const getFrameStyle = (styleId: FrameStyle): string => {
  return frameStyles[styleId]?.className || ''
}
