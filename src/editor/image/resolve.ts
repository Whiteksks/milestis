import type { FrameStyle, TemplateId } from '@/editor/lib/types'
import type { ImageFocalPoint, ImageRatioValue, ImageValue } from './data'
import { getEffectiveImagePolicy } from './policy/registry'
import type { ImagePolicy } from './policy/types'
import type { ResolvedImage } from './render'
import type { ImageSlotId } from './slots'

function resolveRatio(value: ImageValue, policy: ImagePolicy): ImageRatioValue {
  if (policy.ratio.forced) {
    return policy.ratio.forced
  }

  const candidate = value.presentation?.ratio ?? policy.ratio.default
  if (!policy.ratio.allowed || policy.ratio.allowed.includes(candidate)) {
    return candidate
  }

  return policy.ratio.default
}

function resolveFrameStyle(value: ImageValue, policy: ImagePolicy): FrameStyle {
  if (policy.frame.forced) {
    return policy.frame.forced
  }

  const candidate = value.presentation?.frameStyle ?? policy.frame.default
  if (!policy.frame.allowed || policy.frame.allowed.includes(candidate)) {
    return candidate
  }

  return policy.frame.default
}

function resolveCrop(value: ImageValue, policy: ImagePolicy, ratio: ImageRatioValue) {
  // Always honor an explicit user crop — the user made this choice deliberately.
  if (value.crop && value.crop.ratio === ratio && value.crop.origin === 'user') {
    // Reject stale crop if it was stamped for a different asset.
    // assetSrc is optional for backward compat — crops without it are trusted.
    if (!value.crop.assetSrc || value.crop.assetSrc === value.asset.src) {
      return value.crop
    }
  }

  return undefined
}

function resolveObjectPosition(focalPoint: ImageFocalPoint | undefined): string | undefined {
  if (!focalPoint) return undefined
  return `${Math.round(focalPoint.x * 100)}% ${Math.round(focalPoint.y * 100)}%`
}

export function resolveImage(
  value: ImageValue,
  slotId: ImageSlotId,
  templateId?: TemplateId,
): ResolvedImage {
  const policy = getEffectiveImagePolicy(slotId, templateId)

  const ratio = resolveRatio(value, policy)
  const crop = resolveCrop(value, policy, ratio)

  return {
    slotId,
    asset: value.asset,
    crop,
    // objectPosition is only used when crop is absent — gives browser the focal point for cover positioning.
    objectPosition: crop ? undefined : resolveObjectPosition(value.focalPoint),
    ratio,
    frameStyle: resolveFrameStyle(value, policy),
    fit: value.presentation?.fit ?? policy.render.fit,
    usage: policy.render.usage,
    caption: value.caption,
    description: value.description,
  }
}
