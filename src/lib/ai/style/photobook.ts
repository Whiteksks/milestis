import { requestAi, type AiRequestOptions } from '../client'
import type { PhotobookStyleInput, PhotobookStyleResult } from '../server/style/photobook'
export type { PhotobookStyleInput, PhotobookStyleResult } from '../server/style/photobook'

export function decidePhotobookStyle(input: PhotobookStyleInput, options: AiRequestOptions): Promise<PhotobookStyleResult> {
  return requestAi('decidePhotobookStyle', input, options)
}
