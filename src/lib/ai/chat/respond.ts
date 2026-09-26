import { requestAi, type AiRequestOptions } from '../client'
import type { ChatReplyInput } from '../server/chat/respond'
export type { ChatReplyInput } from '../server/chat/respond'

export function generateChatReply(input: ChatReplyInput, options: AiRequestOptions): Promise<string> {
  return requestAi('generateChatReply', input, options)
}
