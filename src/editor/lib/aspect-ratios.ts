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
    description: '4:5 ratio',
    className: 'aspect-[4/5]',
  },
  poster: {
    id: 'poster' as AspectRatio,
    name: 'Poster',
    description: '2:3 ratio',
    className: 'aspect-[2/3]',
  },
  wide: {
    id: 'wide' as AspectRatio,
    name: 'Wide',
    description: '16:9 ratio',
    className: 'aspect-video',
  },
  cinematic: {
    id: 'cinematic' as AspectRatio,
    name: 'Cinematic',
    description: '21:9 ratio',
    className: 'aspect-[21/9]',
  },
}

export const RATIO_LABELS: Record<AspectRatio, string> = {
  square: '1:1',
  portrait: '4:5',
  poster: '2:3',
  wide: '16:9',
  cinematic: '21:9',
}

export const ASPECT_RATIO_NUM: Record<AspectRatio, number> = {
  square: 1,
  portrait: 4 / 5,
  poster: 2 / 3,
  wide: 16 / 9,
  cinematic: 21 / 9,
}

export function getAspectRatioClass(ratio: AspectRatio = 'square'): string {
  return aspectRatios[ratio]?.className || aspectRatios.square.className
}
