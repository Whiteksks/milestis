'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useUiStore } from '@/editor/lib/store/ui'
import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import { saveProject } from '@/lib/projects'

/** All triggers use one snapshot queue; Firestore persists submitted writes locally. */
export function useAutoSave(projectId: string, paused = false) {
  const isDirty = useUiStore((s) => s.isDirty)
  const [saveError, setSaveError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const inFlight = useRef<Promise<void> | null>(null)

  const save = useCallback(async () => {
    if (paused || useUiStore.getState().projectId !== projectId || !useUiStore.getState().isDirty) return
    if (inFlight.current) return inFlight.current
    const task = saveProject(projectId)
    inFlight.current = task
    setIsSaving(true)
    try {
      await task
      setSaveError(false)
    } catch (error) {
      setSaveError(true)
      throw error
    } finally {
      inFlight.current = null
      setIsSaving(false)
    }
  }, [projectId, paused])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let maxWait: ReturnType<typeof setTimeout> | undefined
    let disposed = false
    const dirty = () => useUiStore.getState().projectId === projectId && useUiStore.getState().isDirty
    function schedule() {
      if (disposed || paused) return
      clearTimeout(timer)
      timer = setTimeout(flush, 1500)
      maxWait ??= setTimeout(flush, 10_000)
    }
    function flush() {
      clearTimeout(timer)
      clearTimeout(maxWait)
      maxWait = undefined
      if (paused) return
      void save().catch(() => undefined).finally(() => {
        // Changes made during a write still need saving; retry failures slowly.
        if (!disposed && dirty()) timer = setTimeout(flush, 5000)
      })
    }
    function changed() {
      if (useUiStore.getState().projectId !== projectId) return
      useUiStore.getState().markDirty()
      schedule()
    }
    const unsubContent = useContentStore.subscribe(changed)
    const unsubTheme = useThemeStore.subscribe(changed)
    const visibility = () => { if (document.hidden) flush() }
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty()) return
      flush()
      event.preventDefault()
      event.returnValue = ''
    }
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('beforeunload', beforeUnload)
    window.addEventListener('pagehide', flush)
    window.addEventListener('online', flush)
    window.addEventListener('popstate', flush)
    if (dirty()) schedule()
    return () => {
      disposed = true
      clearTimeout(timer)
      clearTimeout(maxWait)
      unsubContent()
      unsubTheme()
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('beforeunload', beforeUnload)
      window.removeEventListener('pagehide', flush)
      window.removeEventListener('online', flush)
      window.removeEventListener('popstate', flush)
    }
  }, [projectId, save, paused])

  return { save, isDirty, saveError, isSaving }
}
