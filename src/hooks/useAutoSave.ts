'use client'

import { useCallback, useEffect, useRef } from 'react'
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
      await saveProject(projectId)
      markClean()
    } catch {
      // Silent — data stays in Zustand memory, user can retry via Save button
    } finally {
      savingRef.current = false
    }
  }, [projectId, markClean])

  const saveImmediately = useCallback(async () => {
    if (savingRef.current || !useUiStore.getState().isDirty) return
    savingRef.current = true
    try {
      await saveProject(projectId, { bypassQueue: true })
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
      if (document.hidden) void saveImmediately()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [saveImmediately])

  // ── beforeunload: show native browser "Leave site?" dialog ───────────
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!useUiStore.getState().isDirty) return
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // ── pagehide: iOS Safari fires this instead of beforeunload on Back ───
  useEffect(() => {
    function handlePageHide() {
      if (useUiStore.getState().isDirty) void saveImmediately()
    }
    window.addEventListener('pagehide', handlePageHide)
    return () => window.removeEventListener('pagehide', handlePageHide)
  }, [saveImmediately])

  // ── popstate: SPA back-navigation (Android back button, swipe back) ───
  useEffect(() => {
    function handlePopState() {
      if (useUiStore.getState().isDirty) void saveImmediately()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [saveImmediately])

  return { save, isDirty }
}
