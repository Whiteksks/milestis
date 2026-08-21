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
import { applyChanges, applyDefaultPlacement, hasActionableChanges, isProjectBlank } from '@/lib/ai/apply'
import { getProjectImageSelectUrl, getProjectImageThumbUrl } from '@/editor/hooks/use-project-images'
import { defaultPhotobookContent } from '@/editor/modes/photobook/store-slice'
import { defaultPortfolioContent } from '@/editor/modes/portfolio/store-slice'
import type { AiChatMode, AiPhotoRef, AiChatHistoryEntry } from '@/lib/ai/types'

// Maps a managed image's URL back to the stable media-library id of the photo it was created from
function docId(urlToId: Map<string, string>, url: string | undefined): string | undefined {
  return url ? urlToId.get(url) : undefined
}

function docIds(urlToId: Map<string, string>, urls: (string | undefined)[]): string[] {
  return urls.map((u) => docId(urlToId, u)).filter((id): id is string => id !== undefined)
}

// Ids of photos worth sending to the AI as images (must be called AFTER applyDefaultPlacement):
// the four single slots plus story moments, which are individually narrated and need their own
// caption — only gallery is pure bulk filler covered by its section's own label/title/description.
function photobookVisionPhotoIds(urlToId: Map<string, string>): string[] {
  const img = useContentStore.getState().photobookImageContent
  return docIds(urlToId, [
    img.cover?.value.asset.src,
    img.introduction?.value.asset.src,
    img.highlight?.value.asset.src,
    img.ending?.value.asset.src,
    ...img.story.map((s) => s.value.asset.src),
  ])
}

// The store keeps each section pre-filled with nice-looking sample copy (e.g. "Emily & James")
// purely so a brand-new project doesn't look empty in the editor UI — but sending that same text
// to the AI as "current content" backfired: the model read it as real content already there and
// wove new text around it instead of replacing it. Blank out any field that still exactly matches
// its section's untouched sample value before it ever reaches the AI, so the model sees a
// genuinely empty field (needs writing) rather than someone else's placeholder wedding.
function blankDefaults<T extends Record<string, unknown>>(current: T, defaults: T): T {
  const out = { ...current }
  for (const key of Object.keys(out) as (keyof T)[]) {
    if (typeof out[key] === 'string' && out[key] === defaults[key]) out[key] = '' as T[keyof T]
  }
  return out
}

function buildCurrentContent(mode: AiChatMode, urlToId: Map<string, string>): string | undefined {
  const content = useContentStore.getState()
  const theme = useThemeStore.getState()
  if (mode === 'photobook') {
    const c = content.photobookSectionContent
    const d = defaultPhotobookContent
    const img = content.photobookImageContent
    return JSON.stringify({
      templateId: theme.currentTemplateId,
      theme: theme.currentTheme,
      mood: theme.themeCustomizations.photobookMood,
      texture: theme.themeCustomizations.photobookTexture,
      content: {
        cover: blankDefaults(c.cover, d.cover),
        introduction: blankDefaults(c.introduction, d.introduction),
        story: blankDefaults(
          { label: c.story.label, title: c.story.title, date: c.story.date, location: c.story.location },
          { label: d.story.label, title: d.story.title, date: d.story.date, location: d.story.location },
        ),
        gallery: blankDefaults(
          { label: c.gallery.label, title: c.gallery.title, description: c.gallery.description },
          { label: d.gallery.label, title: d.gallery.title, description: d.gallery.description },
        ),
        highlight: blankDefaults(
          { label: c.highlight.label, title: c.highlight.title, description: c.highlight.description, quote: c.highlight.quote },
          { label: d.highlight.label, title: d.highlight.title, description: d.highlight.description, quote: d.highlight.quote },
        ),
        ending: blankDefaults(c.ending, d.ending),
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
  const d = defaultPortfolioContent
  const img = content.portfolioImageContent
  return JSON.stringify({
    templateId: theme.currentTemplateId,
    theme: theme.currentTheme,
    content: {
      hero: blankDefaults(c.hero, d.hero),
      bio: blankDefaults(
        { title: c.bio.title, subtitle: c.bio.subtitle, description: c.bio.description },
        { title: d.bio.title, subtitle: d.bio.subtitle, description: d.bio.description },
      ),
      featuredWork: {
        title: c.featuredWork.title === d.featuredWork.title ? '' : c.featuredWork.title,
        subtitle: c.featuredWork.subtitle === d.featuredWork.subtitle ? '' : c.featuredWork.subtitle,
        projects: c.featuredWork.projects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          tags: p.tags,
          photoId: docId(urlToId, img.featuredWork.find((entry) => entry.id === p.id)?.value.asset.src),
        })),
      },
      contact: blankDefaults(c.contact, d.contact),
      footer: blankDefaults(c.footer, d.footer),
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

    // Prior turns, text only (no photos re-sent) — requests are stateless, this is just for
    // conversational continuity. Captured before addMessage below so it excludes this turn.
    const history: AiChatHistoryEntry[] = messages
      .filter((m) => m.content.trim().length > 0)
      .map((m) => ({ role: m.role, content: m.content }))

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

      // Must read before applyDefaultPlacement mutates the store, so it reflects whether the
      // project truly had zero photos placed prior to this message.
      const currentImageContent =
        editorMode === 'photobook' ? useContentStore.getState().photobookImageContent : useContentStore.getState().portfolioImageContent
      const isBlankProject = isProjectBlank(editorMode as AiChatMode, currentImageContent)

      // Deterministic placement runs before the AI ever sees the photos — it always fully places
      // every photo itself, the AI never reviews or overrides it (unless the user explicitly asks
      // to swap a specific photo, handled entirely via the prompt/imageAssignments, not here)
      applyDefaultPlacement(editorMode as AiChatMode, idToDoc, newPhotoIds)

      // Photobook: cover/introduction/highlight/ending + story moments get vision (each is
      // individually narrated with its own caption). Gallery is pure bulk filler, never sent —
      // its section's own label/title/description covers it as a group.
      // Portfolio: every attached photo may become a distinct featuredWork card with its own
      // description, so nothing is filtered out there — all of it genuinely needs vision.
      const visionIds = editorMode === 'photobook' ? new Set(photobookVisionPhotoIds(urlToId)) : new Set(newPhotoIds)
      const photos: AiPhotoRef[] = newPhotoIds
        .filter((id) => visionIds.has(id))
        .map((id) => ({ id, url: getProjectImageThumbUrl(idToDoc.get(id)!) }))

      const result = await sendMessage({
        mode: editorMode as AiChatMode,
        prompt: trimmed,
        photos,
        language: locale,
        currentContent: buildCurrentContent(editorMode as AiChatMode, urlToId),
        isBlankProject,
        history,
      })

      addMessage({
        role: 'assistant',
        // Guard against the model claiming "edit" success while including nothing actionable —
        // show a clear "didn't work, try again" instead of a misleading confirmation.
        content: result.action === 'edit' && !hasActionableChanges(result.changes) ? t('assistantNoChanges') : result.message,
      })

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
