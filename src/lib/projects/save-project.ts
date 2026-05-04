import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useContentStore } from '@/editor/lib/store-content'
import { useThemeStore } from '@/editor/lib/store-theme'
import { useUiStore } from '@/editor/lib/store-ui'

interface SaveProjectOptions {
  updateDashboardMeta?: boolean
  updateTimestamp?: boolean
}

const saveQueues = new Map<string, Promise<void>>()

/**
 * Firestore rejects documents containing `undefined` values.
 * JSON round-trip strips them since JSON.stringify omits undefined keys.
 */
function stripUndefined<T>(val: T): T {
  return JSON.parse(JSON.stringify(val)) as T
}

export async function saveProject(
  projectId: string,
  { updateDashboardMeta = true, updateTimestamp = true }: SaveProjectOptions = {},
): Promise<void> {
  const previousSave = saveQueues.get(projectId) ?? Promise.resolve()
  const nextSave = previousSave.catch(() => undefined).then(async () => {
    const {
      sectionVisibility,
      sectionContent,
      portfolioImageContent,
      photobookSectionVisibility,
      photobookSectionContent,
      photobookImageContent,
    } = useContentStore.getState()

    const {
      currentTemplateId,
      currentTheme,
      themeCustomizations,
      customDecorations,
    } = useThemeStore.getState()

    const { editorMode } = useUiStore.getState()

    const theme = {
      currentTemplateId,
      currentTheme,
      themeCustomizations,
      customDecorations,
    }

    const content =
      editorMode === 'portfolio'
        ? {
            sectionVisibility,
            sectionContent,
            imageContent: portfolioImageContent,
          }
        : {
            sectionVisibility: photobookSectionVisibility,
            sectionContent: photobookSectionContent,
            imageContent: photobookImageContent,
          }

    const rawHeroThumb =
      editorMode === 'portfolio'
        ? portfolioImageContent.hero?.value.asset.blurDataUrl ?? portfolioImageContent.hero?.value.asset.src
        : photobookImageContent.cover?.value.asset.blurDataUrl ?? photobookImageContent.cover?.value.asset.src

    const payload: Record<string, unknown> = {}

    if (updateDashboardMeta) {
      const preview: Record<string, unknown> = {
        themeId: currentTheme,
        templateId: currentTemplateId,
      }
      const previewImageUrl = rawHeroThumb
      if (previewImageUrl && (previewImageUrl.startsWith('http://') || previewImageUrl.startsWith('https://'))) {
        preview.heroImageUrl = previewImageUrl
      }

      if (editorMode === 'portfolio') {
        if (sectionContent.hero.title) preview.title = sectionContent.hero.title
        if (sectionContent.hero.subtitle) preview.subtitle = sectionContent.hero.subtitle
        if (portfolioImageContent.hero?.value.presentation?.ratio) preview.aspectRatio = portfolioImageContent.hero.value.presentation.ratio
        if (portfolioImageContent.hero?.value.presentation?.frameStyle) preview.frameStyle = portfolioImageContent.hero.value.presentation.frameStyle
      } else {
        if (photobookSectionContent.cover.title) preview.title = photobookSectionContent.cover.title
        if (photobookSectionContent.cover.subtitle) preview.subtitle = photobookSectionContent.cover.subtitle
        if (photobookSectionContent.cover.date) preview.date = photobookSectionContent.cover.date
        if (photobookImageContent.cover?.value.presentation?.ratio) {
          preview.aspectRatio = photobookImageContent.cover.value.presentation.ratio
        }
        if (photobookImageContent.cover?.value.presentation?.frameStyle) {
          preview.frameStyle = photobookImageContent.cover.value.presentation.frameStyle
        }
      }

      payload.preview = preview
    }

    if (updateTimestamp) {
      payload.updatedAt = serverTimestamp()
    }

    const contentDocRef = doc(db, 'projects', projectId, 'data', 'content')
    await setDoc(contentDocRef, {
      theme: stripUndefined(theme),
      content: stripUndefined(content),
    }, { merge: true })

    if (Object.keys(payload).length > 0) {
      await updateDoc(doc(db, 'projects', projectId), payload)
    }
  })

  saveQueues.set(projectId, nextSave)

  try {
    await nextSave
  } finally {
    if (saveQueues.get(projectId) === nextSave) {
      saveQueues.delete(projectId)
    }
  }
}
