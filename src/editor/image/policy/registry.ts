import { aspectRatios } from '@/editor/lib/config/aspect-ratios'
import { frameStyles } from '@/editor/lib/config/frame-styles'
import type { AspectRatio, FrameStyle, TemplateId } from '@/editor/lib/types'
import type { ImageSlotId } from '../slots'
import type { ImageOptionPolicy, ImagePolicy } from './types'
import { getTemplatePolicyOverride, type TemplateOptionOverride } from './template-overrides'

export const ALL_IMAGE_RATIO_OPTIONS = Object.keys(aspectRatios) as AspectRatio[]
export const ALL_IMAGE_FRAME_OPTIONS = Object.keys(frameStyles) as FrameStyle[]

function applyOptionOverride<T>(
  base: ImageOptionPolicy<T>,
  override?: TemplateOptionOverride<T>,
): ImageOptionPolicy<T> {
  if (!override) {
    return base
  }

  let allowed = override.allowed ?? base.allowed

  if (override.only) {
    allowed = override.only
  }

  if (override.hide?.length) {
    allowed = (allowed ?? []).filter((entry) => !override.hide?.includes(entry))
  }

  return {
    ...base,
    ...(override.forced !== undefined && { forced: override.forced }),
    ...(allowed !== undefined && { allowed }),
  }
}

export const IMAGE_POLICY_REGISTRY: Record<ImageSlotId, ImagePolicy> = {
  'photobook.cover.primary': {
    ratio: { default: 'portrait', allowed: ALL_IMAGE_RATIO_OPTIONS },
    frame: { default: 'none', allowed: ALL_IMAGE_FRAME_OPTIONS },
    render: { fit: 'cover', usage: 'inline' },
  },
  'photobook.introduction.primary': {
    ratio: { default: 'portrait', allowed: ALL_IMAGE_RATIO_OPTIONS },
    frame: { default: 'none', allowed: ALL_IMAGE_FRAME_OPTIONS },
    render: { fit: 'cover', usage: 'inline' },
  },
  'photobook.story.block': {
    ratio: { default: 'wide', allowed: ALL_IMAGE_RATIO_OPTIONS },
    frame: { default: 'none', allowed: ALL_IMAGE_FRAME_OPTIONS },
    render: { fit: 'cover', usage: 'inline' },
  },
  'photobook.gallery.item': {
    ratio: { default: 'portrait', allowed: ALL_IMAGE_RATIO_OPTIONS },
    frame: { default: 'none', allowed: ALL_IMAGE_FRAME_OPTIONS },
    render: { fit: 'cover', usage: 'inline' },
  },
  'photobook.highlight.primary': {
    ratio: { default: 'wide', allowed: ALL_IMAGE_RATIO_OPTIONS },
    frame: { default: 'none', allowed: ALL_IMAGE_FRAME_OPTIONS },
    render: { fit: 'cover', usage: 'inline' },
  },
  'photobook.ending.primary': {
    ratio: { default: 'portrait', allowed: ALL_IMAGE_RATIO_OPTIONS },
    frame: { default: 'none', allowed: ALL_IMAGE_FRAME_OPTIONS },
    render: { fit: 'cover', usage: 'inline' },
  },
  'portfolio.hero.primary': {
    ratio: { default: 'wide', allowed: ALL_IMAGE_RATIO_OPTIONS },
    frame: { default: 'none', allowed: ALL_IMAGE_FRAME_OPTIONS },
    render: { fit: 'cover', usage: 'background' },
  },
  'portfolio.bio.primary': {
    ratio: { default: 'portrait', allowed: ALL_IMAGE_RATIO_OPTIONS },
    frame: { default: 'soft', allowed: ALL_IMAGE_FRAME_OPTIONS },
    render: { fit: 'cover', usage: 'inline' },
  },
  'portfolio.featured-work.item': {
    ratio: { default: 'portrait', allowed: ALL_IMAGE_RATIO_OPTIONS },
    frame: { default: 'none', allowed: ALL_IMAGE_FRAME_OPTIONS },
    render: { fit: 'cover', usage: 'fill' },
  },
}

export function getImagePolicy(slotId: ImageSlotId): ImagePolicy {
  return IMAGE_POLICY_REGISTRY[slotId]
}

export function getEffectiveImagePolicy(slotId: ImageSlotId, templateId?: TemplateId): ImagePolicy {
  const basePolicy = getImagePolicy(slotId)
  if (!templateId) {
    return basePolicy
  }

  const override = getTemplatePolicyOverride(templateId, slotId)
  if (!override) {
    return basePolicy
  }

  return {
    ...basePolicy,
    ratio: applyOptionOverride(basePolicy.ratio, override.ratio),
    frame: applyOptionOverride(basePolicy.frame, override.frame),
  }
}
