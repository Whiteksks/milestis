/** Single source of truth for event template IDs.
 *  To add a new event template — add its id here. That's all. */
export const EVENT_TEMPLATE_IDS = [
  'event-gallery',
  'event-film',
  'event-cosmos',
  'event-parallax',
  'event-bubbles',
  'event-coverflow',
  'event-magazine',
] as const

export type EventTemplateId = (typeof EVENT_TEMPLATE_IDS)[number]
