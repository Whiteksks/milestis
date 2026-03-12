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

  await updateDoc(doc(db, 'projects', projectId), {
    theme: stripUndefined(theme),
    content: stripUndefined(content),
    updatedAt: serverTimestamp(),
  })
}
