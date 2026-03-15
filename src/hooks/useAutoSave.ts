'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useUiStore } from '@/editor/lib/store-ui'
import { useContentStore } from '@/editor/lib/store-content'
import { useThemeStore } from '@/editor/lib/store-theme'
import { saveProject } from '@/lib/projects'

/**
 * Auto-save hook for the editor.
 *
 * Marks the project dirty whenever content or theme stores change.
 * Saves on:
 *   - Tab hidden / browser minimized (visibilitychange)
 *   - Ctrl+S / Cmd+S
 *   - Manually via the returned `save()` function (used by Home button)
 *
 * Shows native browser "Leave site?" dialog via beforeunload when dirty.
 * NO periodic interval — saves are triggered only by real events.
 */
export function useAutoSave(projectId: string) {
  const isDirty = useUiStore((s) => s.isDirty)
  const markDirty = useUiStore((s) => s.markDirty)
  const markClean = useUiStore((s) => s.markClean)

  // Guard against concurrent saves
  const savingRef = useRef(false)

  // ── Watch content/theme stores, mark dirty on any change ─────────────
  // Runs after first render (by which time project is already hydrated),
  // so rehydration in EditorPage does NOT trigger a false dirty.
  useEffect(() => {
    const unsubContent = useContentStore.subscribe(() => markDirty())
    const unsubTheme = useThemeStore.subscribe(() => markDirty())
    return () => {
      unsubContent()
      unsubTheme()
    }
  }, [markDirty])

  // ── Core save ─────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    if (savingRef.current || !useUiStore.getState().isDirty) return
    savingRef.current = true
    try {
      await saveProject(projectId, {
        updateDashboardMeta: false,
        updateTimestamp: false,
      })
      markClean()
    } catch {
      // Silent — data stays in Zustand memory, user can retry via Save button
    } finally {
      savingRef.current = false
    }
  }, [projectId, markClean])

  // ── visibilitychange: save when tab loses focus ───────────────────────
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) save()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [save])

  // ── beforeunload: show native browser "Leave site?" dialog ───────────
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!useUiStore.getState().isDirty) return
      e.preventDefault()
      e.returnValue = '' // required for Chrome to show the dialog
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // ── Ctrl+S / Cmd+S ────────────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [save])

  return { save, isDirty }
}
