import type { TemplateId } from '@/editor/lib/types'
import { getEffectiveImagePolicy } from '../policy/registry'
import type { ImageSlotId } from '../slots'
import type { ImageCropRect, ImageFocalPoint, ImageRatioValue, ImageValue } from '../data'
import type { FrameStyle } from '@/editor/lib/types'

/**
 * Updates the ratio choice from the user (via RatioPicker).
 *
 * Rules:
 * - If policy forces a ratio, the incoming value is ignored.
 * - Changing ratio clears any existing crop — the old crop was for a different ratio.
 * - Frame and all other fields are preserved.
 */
export function updateImageRatio(
  value: ImageValue,
  slotId: ImageSlotId,
  nextRatio: ImageRatioValue,
  templateId?: TemplateId,
): ImageValue {
  const policy = getEffectiveImagePolicy(slotId, templateId)
  const ratio = policy.ratio.forced ?? nextRatio

  return {
    ...value,
    presentation: {
      ...value.presentation,
      ratio,
    },
    // Ratio changed — any existing crop was tied to the old ratio.
    crop: undefined,
  }
}

/**
 * Updates the frame style choice from the user (via FramePicker).
 *
 * Rules:
 * - If policy forces a frame, the incoming value is ignored.
 * - Frame changes never affect crop.
 */
export function updateImageFrame(
  value: ImageValue,
  slotId: ImageSlotId,
  nextFrame: FrameStyle,
  templateId?: TemplateId,
): ImageValue {
  const policy = getEffectiveImagePolicy(slotId, templateId)
  const frameStyle = policy.frame.forced ?? nextFrame

  return {
    ...value,
    presentation: {
      ...value.presentation,
      frameStyle,
    },
  }
}

/**
 * Saves a user-defined crop from the crop editor.
 *
 * This is the only way to store origin: 'user'.
 * The stored crop will be preserved by resolveCrop as long as ratio matches.
 */
export function setUserCrop(
  value: ImageValue,
  rect: ImageCropRect,
  ratio: ImageRatioValue,
  focalPoint?: ImageFocalPoint,
): ImageValue {
  return {
    ...value,
    focalPoint: focalPoint ?? value.focalPoint,
    crop: {
      origin: 'user',
      ratio,
      rect,
      algorithm: 'manual',
      assetSrc: value.asset.src,
    },
  }
}

/**
 * Clears a saved crop.
 * Used when user explicitly clicks "Reset crop" in the crop editor.
 */
export function clearImageCrop(value: ImageValue): ImageValue {
  return {
    ...value,
    crop: undefined,
  }
}
