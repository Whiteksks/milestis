/** Single source of truth for photobook template IDs.
 *  To add a new photobook template — add its id here. That's all. */
export const PHOTOBOOK_TEMPLATE_IDS = [
  'wedding-timeline',
  'masonry',
  'photobook-classic',
  'photobook-circle',
  'photobook-magazine',
  'photobook-polaroid',
  'photobook-split',
  'photobook-vertical',
  'photobook-memoir',
] as const

export type PhotobookTemplateId = (typeof PHOTOBOOK_TEMPLATE_IDS)[number]
