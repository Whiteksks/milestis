'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useChat } from './use-chat'
import { usePhotoAttach } from './use-photo-attach'
import { ChatMessages } from './chat-messages'
import { SelectedPhotos } from './selected-photos'
import { PhotoPicker } from './photo-picker'
import { ChatInput } from './chat-input'
import { useUiStore } from '@/editor/lib/store/ui'
import { getProjectImageSelectUrl } from '@/editor/hooks/use-project-images'
import { runAiPipeline } from '@/lib/ai/pipeline/orchestrator'
import type { AiChatMode } from '@/lib/ai/core/types'

export function AiChatContent() {
  const t = useTranslations('editor.layout.aiChat')
  const locale = useLocale()
  const editorMode = useUiStore((s) => s.editorMode)

  const { messages, input, setInput, addMessage, isLoading, setIsLoading } = useChat()
  const {
    selectedUrls,
    isPickerOpen,
    setIsPickerOpen,
    handlePhotoButton,
    toggleUrl,
    removeUrl,
    clearSelection,
    fileInputRef,
    images,
    pendingUploads,
    handleFileUpload,
  } = usePhotoAttach()

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed && selectedUrls.length === 0) return

    const photosCopy = [...selectedUrls]

    addMessage({
      role: 'user',
      content: trimmed,
      photos: photosCopy.length > 0 ? photosCopy : undefined,
    })
    setInput('')
    clearSelection()
    setIsPickerOpen(false)
    setIsLoading(true)

    try {
      const idToDoc = new Map(images.map((img) => [img.id, img]))
      const urlToId = new Map(images.map((img) => [getProjectImageSelectUrl(img), img.id]))

      // Photos attached this turn, resolved to their stable media-library ids — photos already
      // placed in the project don't need to be resent, the pipeline reads their current placement
      // directly from the stores.
      const newPhotoIds = photosCopy.map((url) => urlToId.get(url)).filter((id): id is string => id !== undefined)

      const result = await runAiPipeline({
        mode: editorMode as AiChatMode,
        prompt: trimmed,
        language: locale,
        idToDoc,
        newPhotoIds,
      })

      addMessage({
        role: 'assistant',
        content: result.kind === 'chat' ? result.message : t('assistantSuccess'),
      })
    } catch (err) {
      const is429 = err instanceof Error && err.message.includes('429')
      addMessage({ role: 'assistant', content: t(is429 ? 'assistantRateLimit' : 'assistantError') })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      <ChatMessages
          messages={messages}
          isLoading={isLoading}
          greeting={t((editorMode as AiChatMode) === 'photobook' ? 'greetingPhotobook' : 'greetingPortfolio')}
        />
      <SelectedPhotos
        selectedUrls={selectedUrls}
        isPickerOpen={isPickerOpen}
        onRemove={removeUrl}
      />
      <PhotoPicker
        isPickerOpen={isPickerOpen}
        selectedUrls={selectedUrls}
        images={images}
        pendingUploads={pendingUploads}
        onToggle={toggleUrl}
        onUploadClick={() => fileInputRef.current?.click()}
      />
      <ChatInput
        input={input}
        canSend={input.trim().length > 0 || selectedUrls.length > 0}
        isLoading={isLoading}
        isPickerOpen={isPickerOpen}
        selectedCount={selectedUrls.length}
        onInputChange={setInput}
        onSend={handleSend}
        onPhotoButton={handlePhotoButton}
      />
    </div>
  )
}
