'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useChat } from './use-chat'
import { usePhotoAttach } from './use-photo-attach'
import { ChatMessages } from './chat-messages'
import { PhotoPicker } from './photo-picker'
import { ChatInput } from './chat-input'
import { useUiStore } from '@/editor/lib/store/ui'
import { useAiBriefStore } from '@/editor/lib/store/ai-brief'
import { useModeSections } from '@/editor/hooks/use-mode-sections'
import { getProjectImageSelectUrl } from '@/editor/hooks/use-project-images'
import { runAiPipeline, type AiPipelineStage } from '@/lib/ai/pipeline/orchestrator'

const SUCCESS_KEY_BY_INTENT = {
  generate_all: 'assistantSuccessAll',
  edit_theme: 'assistantSuccessTheme',
  edit_section: 'assistantSuccessSection',
} as const

export function AiChatContent() {
  const t = useTranslations('editor.layout.aiChat')
  const locale = useLocale()
  const editorMode = useUiStore((s) => s.editorMode)
  const projectId = useUiStore((s) => s.projectId)
  const request = useRef<AbortController | null>(null)
  const [undo, setUndo] = useState<(() => boolean) | null>(null)
  useEffect(() => () => {
    request.current?.abort()
    request.current = null
    if (useUiStore.getState().projectId === projectId) useUiStore.getState().setAiChatIsLoading(false)
  }, [projectId])
  const hasAiGenerated = useAiBriefStore((s) => s.hasGenerated)
  const requestFocusSection = useUiStore((s) => s.requestFocusSection)
  const setIsAiChatOpen = useUiStore((s) => s.setIsAiChatOpen)
  const { sections } = useModeSections()
  const [loadingCaption, setLoadingCaption] = useState('')

  function handleOpenSection(sectionId: string) {
    requestFocusSection(sectionId)
    setIsAiChatOpen(false)
  }

  const { messages, input, setInput, addMessage, isLoading, setIsLoading } = useChat()
  const {
    selectedUrls,
    toggleUrl,
    toggleAll,
    clearSelection,
    fileInputRef,
    images,
    pendingUploads,
    handleFileUpload,
    retryUpload,
    dismissUpload,
  } = usePhotoAttach()

  function captionForStage(stage: AiPipelineStage): string {
    switch (stage.kind) {
      case 'classifying': return t('loadingClassifying')
      case 'style': return t('loadingStyle')
      case 'writing': return t('loadingWriting', { done: stage.done, total: stage.total })
      case 'replying': return t('loadingReplying')
    }
  }

  async function handleSend() {
    if (!projectId || request.current || useUiStore.getState().aiChatIsLoading) return
    const trimmed = input.trim()
    if (!trimmed && selectedUrls.length === 0) return
    if (editorMode !== 'menu' && editorMode !== 'photobook' && editorMode !== 'portfolio') return
    if (editorMode === 'menu' && selectedUrls.length > 20) {
      addMessage({ role: 'assistant', content: t('tooManyMenuPhotos'), isError: true })
      return
    }
    setUndo(null)
    const controller = new AbortController()
    request.current = controller
    const isCurrent = () => request.current === controller && useUiStore.getState().projectId === projectId

    const photosCopy = [...selectedUrls]

    addMessage({
      role: 'user',
      content: trimmed,
      photos: photosCopy.length > 0 ? photosCopy : undefined,
    })
    setInput('')
    clearSelection()
    setIsLoading(true)
    setLoadingCaption('')

    try {
      const idToDoc = new Map(images.map((img) => [img.id, img]))
      const urlToId = new Map(images.map((img) => [getProjectImageSelectUrl(img), img.id]))

      // Photos attached this turn, resolved to their stable media-library ids — photos already
      // placed in the project don't need to be resent, the pipeline reads their current placement
      // directly from the stores.
      const newPhotoIds = photosCopy.map((url) => urlToId.get(url)).filter((id): id is string => id !== undefined)

      const result = await runAiPipeline({
        projectId,
        signal: controller.signal,
        mode: editorMode,
        prompt: trimmed,
        language: locale,
        history: messages.filter((message) => !message.isError && message.content.trim()).slice(-8)
          .map(({ role, content }) => ({ role, content: content.slice(0, 2000) })),
        idToDoc,
        newPhotoIds,
        onStage: (stage) => { if (isCurrent()) setLoadingCaption(captionForStage(stage)) },
      })
      if (!isCurrent()) return
      if (result.kind === 'applied' && result.undo) setUndo(() => result.undo!)

      const sectionsToOpen = result.kind === 'applied' && result.intent === 'edit_section'
        ? result.sectionsWritten.map((id) => ({ id, name: sections.find((s) => s.id === id)?.name ?? id }))
        : undefined

      addMessage({
        role: 'assistant',
        content: result.kind === 'chat' ? result.message : result.message ?? t(SUCCESS_KEY_BY_INTENT[result.intent]),
        sectionsToOpen,
      })
    } catch (err) {
      if (!isCurrent()) return
      const is429 = err instanceof Error && err.message.includes('429')
      const reason = err instanceof Error ? err.message : ''
      const key = reason === 'AI_PROJECT_CHANGED' ? 'assistantProjectChanged'
        : reason === 'AI_CANCELLED' ? 'assistantCancelled'
        : reason === 'AI_TIMEOUT' ? 'assistantTimeout'
        : reason === 'AI_NOT_CONFIGURED' ? 'assistantNotConfigured'
        : reason.startsWith('AI_DAILY_LIMIT') ? 'assistantDailyLimit'
        : reason === 'AI_REFUSED' ? 'assistantRefused'
        : reason === 'UNAUTHENTICATED' || reason === 'INVALID_SESSION' ? 'assistantSignIn'
        : is429 ? 'assistantRateLimit' : 'assistantError'
      addMessage({ role: 'assistant', content: t(key), isError: true })
      if (reason !== 'AI_CANCELLED') setInput(trimmed)
    } finally {
      if (isCurrent()) {
        request.current = null
        setIsLoading(false)
        setLoadingCaption('')
      }
    }
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden">
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
          greeting={t(
            editorMode === 'menu'
              ? (hasAiGenerated ? 'greetingMenuReturn' : 'greetingMenu')
              : editorMode === 'photobook'
              ? (hasAiGenerated ? 'greetingPhotobookReturn' : 'greetingPhotobook')
              : (hasAiGenerated ? 'greetingPortfolioReturn' : 'greetingPortfolio'),
          )}
          quickPrompts={t.raw(editorMode === 'menu' ? 'quickPromptsMenu' : editorMode === 'photobook' ? 'quickPromptsPhotobook' : 'quickPromptsPortfolio') as string[]}
          onQuickPromptSelect={setInput}
          loadingCaption={loadingCaption}
          onOpenSection={handleOpenSection}
        />
      {undo && !isLoading && <button type="button" className="mx-4 mb-2 self-start rounded-lg border px-3 py-2 text-xs hover:bg-muted" onClick={() => {
        const restored = undo()
        setUndo(null)
        addMessage({ role: 'assistant', content: t(restored ? 'changesUndone' : 'cannotUndo'), isError: !restored })
      }}>{t('undoChanges')}</button>}
      <PhotoPicker
        selectedUrls={selectedUrls}
        images={images}
        pendingUploads={pendingUploads}
        onToggle={toggleUrl}
        onToggleAll={toggleAll}
        onUploadClick={() => fileInputRef.current?.click()}
        onRetry={retryUpload}
        onDismiss={dismissUpload}
      />
      <ChatInput
        input={input}
        canSend={input.trim().length > 0 || selectedUrls.length > 0}
        isLoading={isLoading}
        placeholder={editorMode === 'menu' ? t('menuInputPlaceholder') : undefined}
        onInputChange={setInput}
        onSend={handleSend}
      />
      {isLoading && <button type="button" className="text-xs underline pb-3" onClick={() => request.current?.abort()}>{t('cancelGeneration')}</button>}
    </div>
  )
}
