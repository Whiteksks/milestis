import { useThemeStore } from '@/editor/lib/store-theme'
import {
  getTemplateImageRestrictions,
  type SectionImageRestrictions,
} from '@/editor/lib/restrictions/template-restrictions'

/**
 * Returns the image restrictions for a given section in the currently active template.
 * Components subscribing to this hook re-render automatically when the template changes.
 *
 * Usage: `const restrictions = useSectionRestrictions('hero')`
 */
export function useSectionRestrictions(sectionId: string): SectionImageRestrictions {
  const currentTemplateId = useThemeStore((s) => s.currentTemplateId)
  return getTemplateImageRestrictions(currentTemplateId, sectionId)
}
