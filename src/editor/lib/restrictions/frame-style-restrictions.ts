import type { AspectRatio, FrameStyle } from "../types"

/**
 * Per-style restrictions that affect available options in the editor UI.
 * Add new entries here whenever a frame style requires constrained behaviour.
 */
export interface FrameStyleRestrictions {
  /** If set, the aspect ratio is locked to this value and cannot be changed by the user. */
  lockedAspectRatio?: AspectRatio
}

const RESTRICTIONS: Partial<Record<FrameStyle, FrameStyleRestrictions>> = {
  diamond: { lockedAspectRatio: "square" },
}

/** Returns the restrictions for a given frame style (empty object if none). */
export function getFrameStyleRestrictions(style: FrameStyle): FrameStyleRestrictions {
  return RESTRICTIONS[style] ?? {}
}

/**
 * Returns the effective aspect ratio, respecting any lock imposed by the frame style.
 * Use this wherever the aspect ratio is consumed (cropper, preview, etc.).
 */
export function getEffectiveAspectRatio(
  style: FrameStyle,
  aspectRatio: AspectRatio,
): AspectRatio {
  return RESTRICTIONS[style]?.lockedAspectRatio ?? aspectRatio
}

/**
 * Returns the patch to apply when the user selects a new frame style.
 * Merges any restrictions (e.g. forced aspect ratio) into the update payload.
 */
export function buildFrameStylePatch(
  newStyle: FrameStyle,
): { frameStyle: FrameStyle; aspectRatio?: AspectRatio; cropData?: undefined } {
  const r = RESTRICTIONS[newStyle]
  return {
    frameStyle: newStyle,
    ...(r?.lockedAspectRatio
      ? { aspectRatio: r.lockedAspectRatio, cropData: undefined }
      : {}),
  }
}
