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
   * Showcase: hero is a full-bleed background — aspect ratio and frame style
   * have no visual effect. Crop IS used by the template to pan/zoom the subject.
   */
  showcase: {
    hero: { hideAspectRatio: true, hideFrameStyle: true, hideCrop: true },
  },
  /**
   * Liquid Glass: hero is a full-bleed background with opacity + glass effects.
   * Same reasoning as Showcase — crop works, aspect ratio and frame do not.
   */
  'liquid-glass': {
    hero: { hideAspectRatio: true, hideFrameStyle: true, hideCrop: true },
    bio: { hideAspectRatio: true, hideFrameStyle: true, hideCrop: true },
  },
  /**
   * Elegant: bio photo sits inside a hardcoded aspect-[4/5] container —
   * aspect ratio from data is silently ignored. Frame style IS applied.
   */
  elegant: {
    bio: { hideAspectRatio: true, hideCrop: true },
  },
  /**
   * Bento: bio photo fills a min-height bento cell with no aspect ratio and
   * no frame. Featured work images also fill min-height cells — aspect ratio
   * is ignored; frame style IS applied via imageClassName.
   */
  bento: {
    bio: { hideAspectRatio: true, hideFrameStyle: true, hideCrop: true },
    featuredWork: { hideAspectRatio: true, hideCrop: true },
  },
  /**
   * Grid: featured work images sit inside a hardcoded aspect-[3/4] container —
   * aspect ratio from data is silently ignored. Frame style IS applied.
   */
  grid: {
    featuredWork: { hideAspectRatio: true, hideCrop: true },
  },
  /**
   * Magazine cover: full-bleed background photo with gradient overlay.
   * The image fills the entire viewport — aspect ratio and frame are meaningless.
   * Crop IS used for subject positioning.
   */
  'photobook-magazine': {
    cover: { hideAspectRatio: true, hideFrameStyle: true },
  },
  /**
   * Chronicle cover: same full-bleed fill pattern as Magazine.
   */
  'photobook-chronicle': {
    cover: { hideAspectRatio: true, hideFrameStyle: true },
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
