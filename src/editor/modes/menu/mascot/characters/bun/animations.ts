import type { MascotMood } from '../../types'

/** Each character owns its choreography; menu events know nothing about these poses. */
export const BUN_POSES = {
  idle: { y: [0, -1, 0], rotate: 0, scaleX: 1, scaleY: 1 },
  welcome: { y: [0, -2, 0], rotate: [0, -3, 0], scaleX: 1, scaleY: 1 },
  happy: { y: [0, -6, 0], rotate: 0, scaleX: 1, scaleY: 1 },
  sad: { y: 2, rotate: -3, scaleX: 1, scaleY: 1 },
  curious: { y: 0, rotate: 4, scaleX: 1, scaleY: 1 },
} satisfies Record<MascotMood, object>

export const BUN_STATIC_POSES = {
  idle: { y: 0, rotate: 0 }, welcome: { y: 0, rotate: -3 },
  happy: { y: 0, rotate: 0 }, sad: { y: 2, rotate: -3 }, curious: { y: 0, rotate: 5 },
} satisfies Record<MascotMood, object>
