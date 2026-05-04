import type { ImageRatioValue } from './data'

const ASPECT_RATIO_PRESETS: Record<string, number> = {
  square: 1,
  portrait: 4 / 5,
  poster: 3 / 4,
  wide: 4 / 3,
  cinematic: 16 / 9,
}

export function parseImageRatio(value: ImageRatioValue): number {
  const preset = ASPECT_RATIO_PRESETS[value]

  if (preset) {
    return preset
  }

  const [width, height] = value.split('/').map(Number)
  if (!width || !height) {
    return 1
  }

  return width / height
}