import type { AspectRatio } from './types'

export const aspectRatios = {
  square: {
    id: 'square' as AspectRatio,
    name: 'Square',
    description: '1:1 ratio',
    className: 'aspect-square',
  },
  portrait: {
    id: 'portrait' as AspectRatio,
    name: 'Portrait',
    description: '3:4 ratio',
    className: 'aspect-[3/4]',
  },
  landscape: {
    id: 'landscape' as AspectRatio,
    name: 'Landscape',
    description: '4:3 ratio',
    className: 'aspect-[4/3]',
  },
}

export function getAspectRatioClass(ratio: AspectRatio = 'landscape'): string {
  return aspectRatios[ratio]?.className || aspectRatios.landscape.className
}
