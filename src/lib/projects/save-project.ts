import { doc, writeBatch, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import { useUiStore } from '@/editor/lib/store/ui'
import { MODE_REGISTRY } from '@/editor/lib/modes/registry'

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

/**
 * Builds the exact { theme, content } document body that gets written to
 * projects/{id}/data/content.
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
    customDecorations: modeEntry.uiConfig.hideDecorations ? [] : customDecorations,
  }

  const content = modeEntry.extractContent(contentStore)

  return {
    theme: stripUndefined(theme),
    content: stripUndefined(content),
  }
}

function captureSave(
  { updateDashboardMeta = true, updateTimestamp = true }: SaveProjectOptions = {},
) {
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

  return { theme, content, payload, contentStore, themeStore: useThemeStore.getState() }
}

export async function saveProject(
  projectId: string,
  options: SaveProjectOptions = {},
): Promise<void> {
  if (useUiStore.getState().projectId !== projectId) throw new Error('Project changed before saving')
  // Capture now: a queued save must never read another project's global stores.
  const snapshot = captureSave(options)

  const previousSave = saveQueues.get(projectId) ?? Promise.resolve()
  const nextSave = previousSave.catch(() => undefined).then(async () => {
    const batch = writeBatch(db)
    batch.set(doc(db, 'projects', projectId, 'data', 'content'), { theme: snapshot.theme, content: snapshot.content })
    if (Object.keys(snapshot.payload).length > 0) batch.update(doc(db, 'projects', projectId), snapshot.payload)
    await batch.commit()
    if (useUiStore.getState().projectId === projectId
      && useContentStore.getState() === snapshot.contentStore
      && useThemeStore.getState() === snapshot.themeStore) {
      useUiStore.getState().markClean()
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
