import type { MascotMood } from '../../types'

/** Pepper sways, greets with a quick wiggle and celebrates with a little dance. */
export const PEPPER_POSES = {
  idle: { y: [0, -1, 0], rotate: 0, scaleX: 1, scaleY: 1 },
  welcome: { y: [0, -2, 0], rotate: [0, -4, 0], scaleX: 1, scaleY: 1 },
  happy: { y: [0, -6, 0], rotate: 0, scaleX: 1, scaleY: 1 },
  sad: { y: 3, rotate: 6, scaleX: 1, scaleY: 1 },
  curious: { y: -1, rotate: -6, scaleX: 1, scaleY: 1 },
} satisfies Record<MascotMood, object>

export const PEPPER_STATIC_POSES = {
  idle: { y: 0, rotate: 0 }, welcome: { y: 0, rotate: -5 },
  happy: { y: 0, rotate: -6 }, sad: { y: 3, rotate: 8 }, curious: { y: -2, rotate: -10 },
} satisfies Record<MascotMood, object>
