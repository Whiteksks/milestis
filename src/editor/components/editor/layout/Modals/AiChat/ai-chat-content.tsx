'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useChat } from './use-chat'
import { usePhotoAttach } from './use-photo-attach'
import { ChatMessages } from './chat-messages'
import { SelectedPhotos } from './selected-photos'
import { PhotoPicker } from './photo-picker'
import { ChatInput } from './chat-input'
import { useUiStore } from '@/editor/lib/store/ui'
import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import { sendMessage } from '@/lib/ai/service'
import { applyChanges } from '@/lib/ai/apply'
import { getProjectImageSelectUrl } from '@/editor/hooks/use-project-images'
import type { AiChatMode, AiPhotoRef } from '@/lib/ai/types'

// Maps a managed image's URL back to the stable media-library id of the photo it was created from
function docId(urlToId: Map<string, string>, url: string | undefined): string | undefined {
  return url ? urlToId.get(url) : undefined
}

function docIds(urlToId: Map<string, string>, urls: (string | undefined)[]): string[] {
  return urls.map((u) => docId(urlToId, u)).filter((id): id is string => id !== undefined)
}

function buildCurrentContent(mode: AiChatMode, urlToId: Map<string, string>): string | undefined {
  const content = useContentStore.getState()
  const theme = useThemeStore.getState()
  if (mode === 'photobook') {
    const c = content.photobookSectionContent
    const img = content.photobookImageContent
    return JSON.stringify({
      templateId: theme.currentTemplateId,
      theme: theme.currentTheme,
      mood: theme.themeCustomizations.photobookMood,
      texture: theme.themeCustomizations.photobookTexture,
      content: {
        cover: c.cover,
        introduction: c.introduction,
        story: { label: c.story.label, title: c.story.title, date: c.story.date, location: c.story.location },
        gallery: { label: c.gallery.label, title: c.gallery.title, description: c.gallery.description },
        highlight: { label: c.highlight.label, title: c.highlight.title, description: c.highlight.description, quote: c.highlight.quote },
        ending: c.ending,
      },
      // Stable photo id currently occupying each slot — permanent, valid across turns
      currentImageAssignments: {
        cover: docId(urlToId, img.cover?.value.asset.src),
        introduction: docId(urlToId, img.introduction?.value.asset.src),
        story: docIds(urlToId, img.story.map((i) => i.value.asset.src)),
        gallery: docIds(urlToId, img.gallery.map((i) => i.value.asset.src)),
        highlight: docId(urlToId, img.highlight?.value.asset.src),
        ending: docId(urlToId, img.ending?.value.asset.src),
      },
    })
  }
  const c = content.sectionContent
  const img = content.portfolioImageContent
  return JSON.stringify({
    templateId: theme.currentTemplateId,
    theme: theme.currentTheme,
    content: {
      hero: c.hero,
      bio: { title: c.bio.title, subtitle: c.bio.subtitle, description: c.bio.description },
      featuredWork: {
        title: c.featuredWork.title,
        subtitle: c.featuredWork.subtitle,
        projects: c.featuredWork.projects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          tags: p.tags,
          photoId: docId(urlToId, img.featuredWork.find((entry) => entry.id === p.id)?.value.asset.src),
        })),
      },
      contact: c.contact,
      footer: c.footer,
    },
    currentImageAssignments: {
      hero: docId(urlToId, img.hero?.value.asset.src),
      bio: docId(urlToId, img.bio?.value.asset.src),
    },
  })
}

export function AiChatContent() {
  const t = useTranslations('editor.layout.aiChat')
  const locale = useLocale()
  const editorMode = useUiStore((s) => s.editorMode)
  const projectId = useUiStore((s) => s.projectId)

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
      // placed in the project don't need to be resent, the model sees them via currentImageAssignments
      const newPhotoIds = photosCopy.map((url) => urlToId.get(url)).filter((id): id is string => id !== undefined)
      const photos: AiPhotoRef[] = newPhotoIds.map((id) => ({ id, url: getProjectImageSelectUrl(idToDoc.get(id)!) }))

      const result = await sendMessage({
        mode: editorMode as AiChatMode,
        prompt: trimmed,
        photos,
        language: locale,
        projectId,
        currentContent: buildCurrentContent(editorMode as AiChatMode, urlToId),
      })

      addMessage({ role: 'assistant', content: result.message })

      if (result.action === 'edit' && result.changes) {
        applyChanges(result, idToDoc, newPhotoIds)
      }
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
