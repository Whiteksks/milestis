import type { ImageRatioValue } from '../data'
import type { FrameStyle } from '@/editor/lib/types'
import type { ImageSlotId } from '../slots'
import type { ImageOptionPolicy } from './types'

/** Per-template overrides that narrow or override a slot's policy.
 *
 *  Structure: templateId → slotId → override fields.
 *
 *  Use `ratio.forced` / `frame.forced` to hard-lock a field for a specific
 *  template regardless of what the user has stored or what the slot default is.
 *  The override is applied AFTER the base slot policy — it wins.
 */
export interface TemplateOptionOverride<T> extends Omit<ImageOptionPolicy<T>, 'default'> {
  only?: readonly T[]
  hide?: readonly T[]
}

export interface TemplatePolicyOverride {
  ratio?: TemplateOptionOverride<ImageRatioValue>
  frame?: TemplateOptionOverride<FrameStyle>
}

const TEMPLATE_OVERRIDES: Record<string, Partial<Record<ImageSlotId, TemplatePolicyOverride>>> = {
  'photobook-soleil': {
    'photobook.cover.primary': {
      // Side-by-side narrow column: tall editorial images work, landscape does not.
      ratio: { only: ['portrait', 'poster'] },
    },
    'photobook.highlight.primary': {
      // Statement image sits above centered text and can support wider treatments.
      ratio: { only: ['wide', 'cinematic', 'square'] },
    },
    'photobook.ending.primary': {
      // Closing image is a narrow decorative block.
      ratio: { only: ['portrait', 'poster', 'square'] },
    },
  },

  'photobook-lumiere': {
    'photobook.cover.primary': {
      // Full-bleed background cover: only cinematic landscape crops make sense.
      ratio: { only: ['wide', 'cinematic'] },
      frame: { only: ['none'] },
    },
    'photobook.highlight.primary': {
      // Framed statement photo inside a content column.
      ratio: { only: ['wide', 'cinematic', 'square'] },
      frame: { hide: ['border-bold', 'passepartout', 'border-dark', 'newspaper'] },
    },
    'photobook.ending.primary': {
      // Narrow closing image already gets a film-frame wrapper in the template.
      ratio: { only: ['portrait', 'poster', 'square'] },
      frame: { hide: ['border-bold', 'passepartout', 'border-dark', 'newspaper'] },
    },
  },

  'photobook-memoir': {
    'photobook.highlight.primary': {
      // Two-column highlight image reads best as a taller block.
      ratio: { only: ['portrait', 'poster', 'square'] },
    },
    'photobook.ending.primary': {
      // Closing image is an optional narrow insert.
      ratio: { only: ['portrait', 'poster', 'square'] },
    },
  },

  'photobook-chronicle': {
    'photobook.cover.primary': {
      // Full-bleed documentary cover.
      ratio: { only: ['wide', 'cinematic'] },
      frame: { only: ['none'] },
    },
    'photobook.highlight.primary': {
      // Cinematic highlight panel uses a background image.
      ratio: { only: ['wide', 'cinematic'] },
      frame: { only: ['none'] },
    },
    'photobook.ending.primary': {
      // Optional ending photo sits in a narrow side column.
      ratio: { only: ['portrait', 'poster', 'square'] },
    },
  },

  'photobook-magazine': {
    'photobook.cover.primary': {
      // Full-bleed masthead cover.
      ratio: { only: ['wide', 'cinematic'] },
      frame: { only: ['none'] },
    },
    'photobook.highlight.primary': {
      // Full-bleed highlight panel.
      ratio: { only: ['wide', 'cinematic'] },
      frame: { only: ['none'] },
    },
    'photobook.ending.primary': {
      // Full-bleed closing panel mirrors the magazine cover.
      ratio: { only: ['wide', 'cinematic'] },
      frame: { only: ['none'] },
    },
  },
}

export function getTemplatePolicyOverride(
  templateId: string,
  slotId: ImageSlotId,
): TemplatePolicyOverride | undefined {
  return TEMPLATE_OVERRIDES[templateId]?.[slotId]
}
