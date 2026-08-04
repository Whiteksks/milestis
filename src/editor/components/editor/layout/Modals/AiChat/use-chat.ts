import { useShallow } from 'zustand/react/shallow'
import { useUiStore } from '@/editor/lib/store/ui'

export function useChat() {
  return useUiStore(
    useShallow((s) => ({
      messages: s.aiChatMessages,
      input: s.aiChatInput,
      isLoading: s.aiChatIsLoading,
      addMessage: s.addAiChatMessage,
      setInput: s.setAiChatInput,
      setIsLoading: s.setAiChatIsLoading,
    })),
  )
}
