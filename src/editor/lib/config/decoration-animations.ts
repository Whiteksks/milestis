/**
 * Decoration Animation Registry
 * ─────────────────────────────
 * To add a new animation:
 *   1. Add an entry to DECORATION_ANIMATIONS below.
 *   2. That's it — the type, framer-motion variants, and UI list update automatically.
 */

import type { Variants } from 'framer-motion'

export interface DecorationAnimationConfig {
  /** Human-readable label shown in the sidebar select. */
  label: string
  /** framer-motion initial/animate variants applied to each decoration element. */
  variants: Pick<Variants, 'initial' | 'animate'>
}

export const DECORATION_ANIMATIONS = {
  none: {
    label: 'None',
    variants: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
    },
  },
  fade: {
    label: 'Fade In',
    variants: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
  },
} as const satisfies Record<string, DecorationAnimationConfig>

/** Union type derived automatically from the registry keys. */
export type DecorationAnimation = keyof typeof DECORATION_ANIMATIONS

/** All entries as an ordered array — ready to render <SelectItem> in the sidebar. */
export const decorationAnimationOptions = Object.entries(DECORATION_ANIMATIONS).map(
  ([id, config]) => ({ id: id as DecorationAnimation, label: config.label }),
)

/** Returns the framer-motion variants for a given animation key. */
export function getDecorationAnimationVariants(animation?: DecorationAnimation | string) {
  const entry = DECORATION_ANIMATIONS[animation as DecorationAnimation]
  return (entry ?? DECORATION_ANIMATIONS.fade).variants
}
