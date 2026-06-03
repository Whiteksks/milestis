/** Single source of truth for photobook template IDs.
 *  To add a new photobook template — add its id here. That's all. */
export const PHOTOBOOK_TEMPLATE_IDS = [
  'photobook-memoir',
  'photobook-chronicle',
  'photobook-magazine',
  'photobook-lumiere',
  'photobook-soleil',
] as const

export type PhotobookTemplateId = (typeof PHOTOBOOK_TEMPLATE_IDS)[number]
