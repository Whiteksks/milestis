import type { MascotMood } from '../../types'

/** Each character owns its choreography; menu events know nothing about these poses. */
export const BUN_POSES = {
  idle: { y: [0, -1.5, 0], rotate: 0, scaleX: 1, scaleY: [1, 1.015, 1] },
  welcome: { y: [0, -3, 0], rotate: [0, -5, 4, 0], scaleX: 1, scaleY: 1 },
  happy: { y: [0, 3, -12, 0, -5, 0], rotate: [0, -3, 3, 0], scaleX: [1, 1.06, 0.96, 1], scaleY: [1, 0.94, 1.06, 1] },
  sad: { y: [0, 3, 2], rotate: [0, -5, -3], scaleX: 1.025, scaleY: 0.96 },
  curious: { y: 0, rotate: [0, 8, 5], scaleX: 1, scaleY: 1 },
} satisfies Record<MascotMood, object>

export const BUN_STATIC_POSES = {
  idle: { y: 0, rotate: 0 }, welcome: { y: 0, rotate: -3 },
  happy: { y: 0, rotate: 0 }, sad: { y: 2, rotate: -3 }, curious: { y: 0, rotate: 5 },
} satisfies Record<MascotMood, object>
