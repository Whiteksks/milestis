'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUiSelector, useThemeSelector } from '@/editor/lib/store'
import { useUiStore } from '@/editor/lib/store/ui'
import { useContentStore } from '@/editor/lib/store/content'
import { getTheme } from '@/editor/lib/config/themes'
import { PhotobookTextureOverlay, getMoodFilter } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'
import type { EventTemplateProps } from '@/editor/lib/template-types'
import type { EventGuestPhoto } from '@/editor/modes/event/content-types'
import { PhotoLightbox } from './templates/photo-lightbox'

interface EventTemplateShellProps {
  Design: React.ComponentType<EventTemplateProps>
}

/**
 * EventTemplateShell
 *
 * Bridges the event photo data pipeline to the template component.
 *
 * Responsibilities:
 *   1. Reads the current projectId from UiStore (set by the editor page on load).
 *   2. Reads the active theme from ThemeStore and resolves it to a ThemeConfig.
 *   3. Opens a Firestore onSnapshot listener on
 *      `projects/{projectId}/eventPhotos` (status == "approved")
 *      and syncs approved photos into the EventSlice via setEventPhotos.
 *   4. Renders the template Design with the resolved theme + live eventPhotos.
 *
 * The listener is torn down when the component unmounts (editor closed / project changed).
 */
export function EventTemplateShell({ Design }: EventTemplateShellProps) {
  const projectId      = useUiSelector((s) => s.projectId)
  const eventPhotos    = useContentStore((s) => s.eventPhotos)
  const setEventPhotos = useContentStore((s) => s.setEventPhotos)

  const isModerationOpen    = useUiSelector((s) => s.isModerationOpen)
  const setIsModerationOpen = useUiStore((s) => s.setIsModerationOpen)

  const [modIndex, setModIndex] = useState<number | null>(null)

  // Открыть лайтбокс при нажатии кнопки «Модерация» в хедере
  useEffect(() => {
    if (!isModerationOpen) return
    if (eventPhotos.length > 0) {
      setModIndex(0)
    } else {
      setIsModerationOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModerationOpen])

  const handleModClose = useCallback(() => {
    setModIndex(null)
    setIsModerationOpen(false)
  }, [setIsModerationOpen])

  const handleModDelete = useCallback(async (photo: EventGuestPhoto) => {
    if (!projectId) return
    const currentIdx = modIndex!
    const newLen = eventPhotos.length - 1
    if (newLen === 0) {
      setModIndex(null)
      setIsModerationOpen(false)
    } else {
      setModIndex(Math.min(currentIdx, newLen - 1))
    }
    await updateDoc(doc(db, 'projects', projectId, 'eventPhotos', photo.id), { status: 'rejected' })
  }, [projectId, modIndex, eventPhotos.length, setIsModerationOpen])

  const { currentTheme, themeCustomizations } = useThemeSelector((s) => ({
    currentTheme:        s.currentTheme,
    themeCustomizations: s.themeCustomizations,
  }))
  const theme = useMemo(() => getTheme(currentTheme), [currentTheme])

  const mood       = themeCustomizations.photobookMood    ?? 'none'
  const texture    = themeCustomizations.photobookTexture ?? 'none'
  const moodFilter = getMoodFilter(mood)

  // Sync approved photos from Firestore into the store
  useEffect(() => {
    if (!projectId) return

    const q = query(
      collection(db, 'projects', projectId, 'eventPhotos'),
      where('status', '==', 'approved'),
      orderBy('uploadedAt', 'desc'),
    )

    const unsub = onSnapshot(q, (snap) => {
      const photos: EventGuestPhoto[] = snap.docs.map((d) => ({
        id:         d.id,
        storageRef: d.data().storageRef as string,
        uploadedAt: (d.data().uploadedAt?.toMillis?.() as number | undefined) ?? null,
        thumbUrl:   d.data().thumbUrl   as string | undefined,
        fullUrl:    d.data().fullUrl    as string | undefined,
      }))
      setEventPhotos(photos)
    })

    return unsub
  }, [projectId, setEventPhotos])

  return (
    <div
      className="relative overflow-hidden"
      style={moodFilter !== 'none' ? { filter: moodFilter } : undefined}
    >
      <Design
        theme={theme}
        eventPhotos={eventPhotos}
      />
      <PhotobookTextureOverlay texture={texture} />

      {/* Кнопка модерации перенесена в editor-header */}
      <PhotoLightbox
        photos={eventPhotos}
        index={modIndex}
        onClose={handleModClose}
        onPrev={() => setModIndex((i) => i !== null ? (i - 1 + eventPhotos.length) % eventPhotos.length : null)}
        onNext={() => setModIndex((i) => i !== null ? (i + 1) % eventPhotos.length : null)}
        moderation
        onDelete={handleModDelete}
      />
    </div>
  )
}
