'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useUiStore } from '@/editor/lib/store/ui'
import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import { saveProject, buildSaveContentPayload } from '@/lib/projects'

/**
 * Fire-and-forget save via navigator.sendBeacon — the browser queues this delivery even as
 * the page unloads, unlike a normal fetch/Firestore write which iOS Safari frequently kills
 * mid-flight during a refresh or tab close. Silent no-op if unsupported or it fails.
 */
function sendBeaconSave(projectId: string) {
  if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') return
  try {
    const { theme, content } = buildSaveContentPayload()
    const blob = new Blob([JSON.stringify({ projectId, theme, content })], { type: 'application/json' })
    navigator.sendBeacon('/api/projects/beacon-save', blob)
  } catch {
    // Best-effort — normal save paths remain the primary mechanism.
  }
}

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
      sendBeaconSave(projectId)
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [projectId])

  // ── pagehide: iOS Safari fires this instead of beforeunload on Back ───
  // The async Firestore write from saveImmediately() is frequently killed mid-flight by iOS
  // before it reaches the network, so sendBeacon (browser-guaranteed delivery) runs alongside
  // it as a fallback rather than a replacement.
  useEffect(() => {
    function handlePageHide() {
      if (!useUiStore.getState().isDirty) return
      sendBeaconSave(projectId)
      void saveImmediately()
    }
    window.addEventListener('pagehide', handlePageHide)
    return () => window.removeEventListener('pagehide', handlePageHide)
  }, [projectId, saveImmediately])

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
