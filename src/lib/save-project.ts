import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { useContentStore } from '@/editor/lib/store-content'
import { useThemeStore } from '@/editor/lib/store-theme'
import { useUiStore } from '@/editor/lib/store-ui'

/**
 * Firestore rejects documents containing `undefined` values.
 * JSON round-trip strips them since JSON.stringify omits undefined keys.
 */
function stripUndefined<T>(val: T): T {
  return JSON.parse(JSON.stringify(val)) as T
}

export async function saveProject(projectId: string): Promise<void> {
  const {
    sectionVisibility,
    sectionContent,
    photobookSectionVisibility,
    photobookSectionContent,
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
      ? { sectionVisibility, sectionContent }
      : { sectionVisibility: photobookSectionVisibility, sectionContent: photobookSectionContent }

  const rawHeroImage =
    editorMode === 'portfolio'
      ? sectionContent.hero.image
      : photobookSectionContent.cover.images?.image

  const rawHeroThumb =
    editorMode === 'portfolio'
      ? sectionContent.hero.heroThumb
      : photobookSectionContent.cover.images?.thumbUrl

  const preview: Record<string, string> = {
    themeId: currentTheme,
    templateId: currentTemplateId,
  }
  const previewImageUrl = rawHeroImage ? (rawHeroThumb || rawHeroImage) : undefined
  if (previewImageUrl && (previewImageUrl.startsWith('http://') || previewImageUrl.startsWith('https://'))) {
    preview.heroImageUrl = previewImageUrl
  }

  if (editorMode === 'portfolio') {
    if (sectionContent.hero.title)    preview.title    = sectionContent.hero.title
    if (sectionContent.hero.subtitle) preview.subtitle = sectionContent.hero.subtitle
    if (sectionContent.hero.aspectRatio) preview.aspectRatio = sectionContent.hero.aspectRatio
    if (sectionContent.hero.frameStyle)  preview.frameStyle  = sectionContent.hero.frameStyle
  } else {
    if (photobookSectionContent.cover.title)    preview.title    = photobookSectionContent.cover.title
    if (photobookSectionContent.cover.subtitle) preview.subtitle = photobookSectionContent.cover.subtitle
    if (photobookSectionContent.cover.date)     preview.date     = photobookSectionContent.cover.date
    if (photobookSectionContent.cover.images?.imageSettings?.[0]?.aspectRatio)
      preview.aspectRatio = photobookSectionContent.cover.images.imageSettings[0].aspectRatio
    if (photobookSectionContent.cover.images?.imageSettings?.[0]?.frameStyle)
      preview.frameStyle  = photobookSectionContent.cover.images.imageSettings[0].frameStyle
  }

  await updateDoc(doc(db, 'projects', projectId), {
    theme: stripUndefined(theme),
    content: stripUndefined(content),
    preview,
    updatedAt: serverTimestamp(),
  })
}
