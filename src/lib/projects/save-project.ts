import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import { useUiStore } from '@/editor/lib/store/ui'
import { MODE_REGISTRY } from '@/editor/lib/modes/registry'

interface SaveProjectOptions {
  updateDashboardMeta?: boolean
  updateTimestamp?: boolean
  bypassQueue?: boolean
}

const saveQueues = new Map<string, Promise<void>>()

/**
 * Firestore rejects documents containing `undefined` values.
 * JSON round-trip strips them since JSON.stringify omits undefined keys.
 */
function stripUndefined<T>(val: T): T {
  return JSON.parse(JSON.stringify(val)) as T
}

/**
 * Builds the exact { theme, content } document body that gets written to
 * projects/{id}/data/content — shared by the normal client-side save and the
 * sendBeacon-based unload fallback in useAutoSave so both write identical shapes.
 */
export function buildSaveContentPayload() {
  const contentStore = useContentStore.getState()

  const {
    currentTemplateId,
    currentTheme,
    themeCustomizations,
    customDecorations,
  } = useThemeStore.getState()

  const { editorMode } = useUiStore.getState()

  const modeEntry = MODE_REGISTRY[editorMode]

  const theme = {
    currentTemplateId,
    currentTheme,
    themeCustomizations,
    customDecorations,
  }

  const content = modeEntry.extractContent(contentStore)

  return {
    theme: stripUndefined(theme),
    content: stripUndefined(content),
  }
}

async function performSaveProject(
  projectId: string,
  { updateDashboardMeta = true, updateTimestamp = true }: SaveProjectOptions = {},
): Promise<void> {
  const contentStore = useContentStore.getState()
  const { currentTheme, currentTemplateId } = useThemeStore.getState()
  const { editorMode } = useUiStore.getState()
  const modeEntry = MODE_REGISTRY[editorMode]

  const { theme, content } = buildSaveContentPayload()

  const payload: Record<string, unknown> = {}

  if (updateDashboardMeta) {
    const preview: Record<string, unknown> = {
      themeId: currentTheme,
      templateId: currentTemplateId,
    }

    const meta = modeEntry.extractPreviewMeta(contentStore)
    if (meta.heroThumbUrl && (meta.heroThumbUrl.startsWith('http://') || meta.heroThumbUrl.startsWith('https://'))) {
      preview.heroImageUrl = meta.heroThumbUrl
    }
    if (meta.title) preview.title = meta.title
    if (meta.subtitle) preview.subtitle = meta.subtitle
    if (meta.date) preview.date = meta.date
    if (meta.aspectRatio) preview.aspectRatio = meta.aspectRatio
    if (meta.frameStyle) preview.frameStyle = meta.frameStyle

    payload.preview = preview
  }

  if (updateTimestamp) {
    payload.updatedAt = serverTimestamp()
  }

  const contentDocRef = doc(db, 'projects', projectId, 'data', 'content')
  await setDoc(contentDocRef, { theme, content })

  if (Object.keys(payload).length > 0) {
    await updateDoc(doc(db, 'projects', projectId), payload)
  }
}

export async function saveProject(
  projectId: string,
  options: SaveProjectOptions = {},
): Promise<void> {
  if (options.bypassQueue) {
    await performSaveProject(projectId, options)
    return
  }

  const previousSave = saveQueues.get(projectId) ?? Promise.resolve()
  const nextSave = previousSave.catch(() => undefined).then(() => performSaveProject(projectId, options))

  saveQueues.set(projectId, nextSave)

  try {
    await nextSave
  } finally {
    if (saveQueues.get(projectId) === nextSave) {
      saveQueues.delete(projectId)
    }
  }
}
