import { resolveImage } from '../resolve'
import type { TemplateId } from '@/editor/lib/types'
import type { ImageSlotId } from '../slots'
import type { ImageValue } from '../data'
import { ContentImage, type ContentImageProps } from './content-image'

export interface SlotImageProps extends Omit<ContentImageProps, 'image'> {
  slotId: ImageSlotId
  value: ImageValue
  /** Pass the active template ID to apply per-template policy overrides.
   *  Example: templateId="photobook-soleil" locks the cover slot to 4/5. */
  templateId?: TemplateId
}

/**
 * The single entry point for rendering images in templates.
 *
 * The template passes a slot ID and raw image data.
 * Policy is applied automatically — ratio, frame, crop bias, fit mode
 * are all resolved here, not in the template.
 *
 * Pass `templateId` to activate template-specific overrides (e.g. forced ratio).
 *
 * Example:
 *   <SlotImage slotId="photobook.cover.primary" templateId="photobook-soleil" value={image} priority />
 */
export function SlotImage({ slotId, value, templateId, ...props }: SlotImageProps) {
  const resolved = resolveImage(value, slotId, templateId)
  return <ContentImage image={resolved} {...props} />
}
