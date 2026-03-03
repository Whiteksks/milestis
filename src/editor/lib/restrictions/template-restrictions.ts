import type { TemplateId } from '../types'

/**
 * Restrictions for an image picker within a specific template section.
 * All fields default to false (no restrictions) unless explicitly set.
 */
export interface SectionImageRestrictions {
  /** Hide the aspect ratio selector — image is displayed at a fixed/fill size. */
  hideAspectRatio?: boolean
  /** Hide the frame style picker — template renders without a frame. */
  hideFrameStyle?: boolean
  /** Hide the crop control — image is used as-is, template ignores crop data. */
  hideCrop?: boolean
}

/**
 * Per-template, per-section image restrictions.
 * Keys are templateId → sectionId → restrictions.
 *
 * To add restrictions for a new template/section, add an entry here.
 */

// template: {
//   hero: { hideAspectRatio: true, hideFrameStyle: true, hideCrop: true },
//   bio: { hideFrameStyle: true },
//   featuredWork: { hideAspectRatio: true },
// },

const TEMPLATE_RESTRICTIONS: Partial<
  Record<TemplateId, Partial<Record<string, SectionImageRestrictions>>>
> = {
  /**
   * Showcase: hero image is rendered as a full-bleed CSS `fill` background.
   * Frame style, aspect ratio and crop data are all ignored by the template.
   */
  showcase: {
    hero: { hideAspectRatio: true, hideFrameStyle: true, hideCrop: true },
  },
  /**
   * Liquid Glass: hero image is rendered as a full-bleed background with an
   * opacity overlay + glass effects. Same reasoning as Showcase.
   */
  'liquid-glass': {
    hero: { hideAspectRatio: true, hideFrameStyle: true, hideCrop: true },
  },
}

/**
 * Returns the image restrictions for a given template + section combination.
 * Returns an empty object (no restrictions) if nothing is configured.
 */
export function getTemplateImageRestrictions(
  templateId: TemplateId,
  sectionId: string,
): SectionImageRestrictions {
  return TEMPLATE_RESTRICTIONS[templateId]?.[sectionId] ?? {}
}
