import { useContentStore } from '@/editor/lib/store-content'
import { useShallow } from 'zustand/react/shallow'

/**
 * Ordered list of numbered photobook sections.
 * Cover is excluded — it is never numbered in the UI.
 */
const NUMBERED_SECTIONS = [
  'introduction',
  'story',
  'gallery',
  'highlight',
  'ending',
] as const

type NumberedSection = (typeof NUMBERED_SECTIONS)[number]

/**
 * Maps a section id to its visibility key in PhotobookSectionVisibility.
 */
const VISIBILITY_KEY: Record<NumberedSection, string> = {
  introduction: 'showIntroduction',
  story: 'showStory',
  gallery: 'showGallery',
  highlight: 'showHighlight',
  ending: 'showEnding',
}

/**
 * Returns the dynamic 1-based position of `sectionId` among currently
 * visible numbered sections. Returns `undefined` if the section is hidden
 * or not a numbered section.
 *
 * @example
 * // If introduction is hidden:
 * usePhotobookSectionNum('story')    // → 1
 * usePhotobookSectionNum('gallery')  // → 2
 */
export function usePhotobookSectionNum(sectionId: string): number | undefined {
  const visibility = useContentStore(
    useShallow((s) => s.photobookSectionVisibility),
  )

  if (!NUMBERED_SECTIONS.includes(sectionId as NumberedSection)) return undefined

  const id = sectionId as NumberedSection
  const visKey = VISIBILITY_KEY[id] as keyof typeof visibility

  // If this section itself is hidden, return undefined
  if (!visibility[visKey]) return undefined

  // Count how many numbered sections before this one are visible
  let num = 0
  for (const s of NUMBERED_SECTIONS) {
    const key = VISIBILITY_KEY[s] as keyof typeof visibility
    if (visibility[key]) num++
    if (s === id) break
  }

  return num
}
