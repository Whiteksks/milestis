import type { MascotMood } from '../../types'

/** Pepper sways, greets with a quick wiggle and celebrates with a little dance. */
export const PEPPER_POSES = {
  idle: { y: 0, rotate: [0, 2, 0, -2, 0], scaleX: 1, scaleY: 1 },
  welcome: { y: [0, -2, 0], rotate: [0, -9, 7, -4, 0], scaleX: 1, scaleY: 1 },
  happy: { y: [0, -9, 0, -6, 0], rotate: [0, -12, 10, -6, 0], scaleX: [1, .96, 1.04, 1], scaleY: [1, 1.04, .96, 1] },
  sad: { y: [0, 3], rotate: [0, 8], scaleX: 1, scaleY: [.99, .96] },
  curious: { y: [0, -2], rotate: [0, -10], scaleX: 1, scaleY: 1.03 },
} satisfies Record<MascotMood, object>

export const PEPPER_STATIC_POSES = {
  idle: { y: 0, rotate: 0 }, welcome: { y: 0, rotate: -5 },
  happy: { y: 0, rotate: -6 }, sad: { y: 3, rotate: 8 }, curious: { y: -2, rotate: -10 },
} satisfies Record<MascotMood, object>
