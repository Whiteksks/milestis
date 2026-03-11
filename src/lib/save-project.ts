import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { useContentStore } from '@/editor/lib/store-content'
import { useThemeStore } from '@/editor/lib/store-theme'
import { useUiStore } from '@/editor/lib/store-ui'

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
    frameStyle,
    themeCustomizations,
    customDecorations,
  } = useThemeStore.getState()

  const { editorMode } = useUiStore.getState()

  const theme = {
    currentTemplateId,
    currentTheme,
    frameStyle,
    themeCustomizations,
    customDecorations,
  }

  const content =
    editorMode === 'portfolio'
      ? { sectionVisibility, sectionContent }
      : { sectionVisibility: photobookSectionVisibility, sectionContent: photobookSectionContent }

  await updateDoc(doc(db, 'projects', projectId), {
    theme,
    content,
    updatedAt: serverTimestamp(),
  })
}
