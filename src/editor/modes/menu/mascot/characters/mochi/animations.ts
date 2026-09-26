import type { MascotMood } from '../../types'

/** Mochi softly squishes, bows to greet and stretches up when curious. */
export const MOCHI_POSES = {
  idle: { y: 0, rotate: 0, scaleX: [1, 1.025, 1], scaleY: [1, .975, 1] },
  welcome: { y: [0, 4, 0], rotate: [0, -4, 0], scaleX: [1, 1.05, 1], scaleY: [1, .9, 1] },
  happy: { y: [0, 3, -8, 0, -3, 0], rotate: [0, -5, 5, 0], scaleX: [1, 1.12, .94, 1.04, 1], scaleY: [1, .86, 1.08, .96, 1] },
  sad: { y: [0, 3], rotate: 0, scaleX: [1, 1.06], scaleY: [1, .9] },
  curious: { y: [0, -3], rotate: [0, -7], scaleX: [1, .96], scaleY: [1, 1.06] },
} satisfies Record<MascotMood, object>

export const MOCHI_STATIC_POSES = {
  idle: { y: 0, rotate: 0, scaleX: 1, scaleY: 1 },
  welcome: { y: 2, rotate: -3, scaleX: 1.03, scaleY: .95 },
  happy: { y: 0, rotate: 0, scaleX: 1, scaleY: 1 },
  sad: { y: 3, rotate: 0, scaleX: 1.06, scaleY: .9 },
  curious: { y: -2, rotate: -7, scaleX: .96, scaleY: 1.06 },
} satisfies Record<MascotMood, object>
