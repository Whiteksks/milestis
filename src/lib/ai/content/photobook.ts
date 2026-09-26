import { requestAi, type AiRequestOptions } from '../client'
import type { PhotobookCoverInput, PhotobookCoverResult, PhotobookIntroductionInput, PhotobookIntroductionResult, PhotobookGalleryInput, PhotobookGalleryResult, PhotobookHighlightInput, PhotobookHighlightResult, PhotobookEndingInput, PhotobookEndingResult, PhotobookStoryInput, PhotobookStoryResult } from '../server/content/photobook'
export type { PhotobookSectionKey, PhotobookCoverInput, PhotobookCoverResult, PhotobookIntroductionInput, PhotobookIntroductionResult, PhotobookGalleryInput, PhotobookGalleryResult, PhotobookHighlightInput, PhotobookHighlightResult, PhotobookEndingInput, PhotobookEndingResult, PhotobookStoryInput, PhotobookStoryResult } from '../server/content/photobook'
export const PHOTOBOOK_SECTION_KEYS = ['cover', 'introduction', 'story', 'gallery', 'highlight', 'ending'] as const

export function generatePhotobookCover(input: PhotobookCoverInput, options: AiRequestOptions): Promise<PhotobookCoverResult> {
  return requestAi('generatePhotobookCover', input, options)
}

export function generatePhotobookIntroduction(input: PhotobookIntroductionInput, options: AiRequestOptions): Promise<PhotobookIntroductionResult> {
  return requestAi('generatePhotobookIntroduction', input, options)
}

export function generatePhotobookGallery(input: PhotobookGalleryInput, options: AiRequestOptions): Promise<PhotobookGalleryResult> {
  return requestAi('generatePhotobookGallery', input, options)
}

export function generatePhotobookHighlight(input: PhotobookHighlightInput, options: AiRequestOptions): Promise<PhotobookHighlightResult> {
  return requestAi('generatePhotobookHighlight', input, options)
}

export function generatePhotobookEnding(input: PhotobookEndingInput, options: AiRequestOptions): Promise<PhotobookEndingResult> {
  return requestAi('generatePhotobookEnding', input, options)
}

export function generatePhotobookStory(input: PhotobookStoryInput, options: AiRequestOptions): Promise<PhotobookStoryResult> {
  return requestAi('generatePhotobookStory', input, options)
}
