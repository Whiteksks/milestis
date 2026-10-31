import type { MascotMood } from '../../types'

/** Mochi softly squishes, bows to greet and stretches up when curious. */
export const MOCHI_POSES = {
  idle: { y: 0, rotate: 0, scaleX: [1, 1.015, 1], scaleY: [1, .985, 1] },
  welcome: { y: [0, 2, 0], rotate: 0, scaleX: [1, 1.03, 1], scaleY: [1, .96, 1] },
  happy: { y: [0, -6, 0], rotate: 0, scaleX: [1, .97, 1], scaleY: [1, 1.04, 1] },
  sad: { y: 3, rotate: 0, scaleX: 1.04, scaleY: .94 },
  curious: { y: -2, rotate: -4, scaleX: 1, scaleY: 1.03 },
} satisfies Record<MascotMood, object>

export const MOCHI_STATIC_POSES = {
  idle: { y: 0, rotate: 0, scaleX: 1, scaleY: 1 },
  welcome: { y: 2, rotate: -3, scaleX: 1.03, scaleY: .95 },
  happy: { y: 0, rotate: 0, scaleX: 1, scaleY: 1 },
  sad: { y: 3, rotate: 0, scaleX: 1.06, scaleY: .9 },
  curious: { y: -2, rotate: -7, scaleX: .96, scaleY: 1.06 },
} satisfies Record<MascotMood, object>
