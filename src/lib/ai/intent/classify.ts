import { requestAi, type AiRequestOptions } from '../client'
import type { AiIntent } from '../core/types'
import type { ClassifyIntentInput } from '../server/intent/classify'
export type { ClassifyIntentInput } from '../server/intent/classify'

export function classifyIntent(input: ClassifyIntentInput, options: AiRequestOptions): Promise<AiIntent> {
  return requestAi('classifyIntent', input, options)
}
