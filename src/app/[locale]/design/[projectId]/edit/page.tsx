'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { useShallow } from 'zustand/react/shallow'
import { db } from '@/lib/firebase'
import { selectAuthLoading, selectCurrentUid, useUserStore } from '@/hooks/useUserStore'
import { Canvas } from '@/editor/components/editor/canvas'
import { EditorHeader } from '@/editor/components/editor/layout/editor-header'
import { FloatingActions } from '@/editor/components/editor/layout/floating-design-buttons'
import { MediaLibraryModal } from '@/editor/components/editor/layout/Modals/media-library-modal'
import { DesignCatalogModal } from '@/editor/components/editor/layout/Modals/design-catalog-modal'
import { SectionsSidebar } from '@/editor/components/editor/layout/sidebar/sections-sidebar'
import { MobileEditorSheet } from '@/editor/components/editor/layout/mobile/mobile-editor-sheet'
import type { DesktopEditorTab, MobileEditorTab } from '@/editor/lib/config/editor-tabs'
import { useUiSelector } from '@/editor/lib/store'
import { useThemeStore } from '@/editor/lib/store/theme'
import { MODE_REGISTRY } from '@/editor/lib/modes/registry'
import type { EditorMode } from '@/editor/lib/editor-mode'
import { CanvasScrollProvider } from '@/editor/components/editor/canvas-scroll-context'
import { PreviewOverlay } from '@/editor/components/editor/layout/preview-overlay'

type LoadState = 'loading' | 'ready' | 'not-found' | 'forbidden' | 'error'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const locale = params.locale as string

  const { uid, authLoading } = useUserStore(
    useShallow((state) => ({ uid: selectCurrentUid(state), authLoading: selectAuthLoading(state) }))
  )

  const setEditorMode = useUiSelector((state) => state.setEditorMode)
  const setProjectId = useUiSelector((state) => state.setProjectId)
  const setProjectName = useUiSelector((state) => state.setProjectName)
  const setIsPublished = useUiSelector((state) => state.setIsPublished)

  const [loadState, setLoadState] = useState<LoadState>('loading')

  useEffect(() => {
    if (authLoading) return
    if (!uid) {
      router.replace(`/${locale}/auth`)
      return
    }

    let cancelled = false

    async function loadProject() {
      try {
        const snap = await getDoc(doc(db, 'projects', projectId))
        if (cancelled) return

        if (!snap.exists()) {
          setLoadState('not-found')
          return
        }

        const project = snap.data()
        if (project.ownerId !== uid) {
          setLoadState('forbidden')
          return
        }

        // Load heavy editor data (theme + content) from the subcollection
        const contentSnap = await getDoc(doc(db, 'projects', projectId, 'data', 'content'))
        if (cancelled) return
        const editorData = contentSnap.exists() ? contentSnap.data() : null

        setEditorMode(project.mode)
        setProjectId(projectId)
        setProjectName(project.name)
        setIsPublished(project.isPublished ?? false)
        if (editorData?.theme) {
          useThemeStore.setState({
            currentTemplateId: editorData.theme.currentTemplateId,
            currentTheme: editorData.theme.currentTheme,
            themeCustomizations: editorData.theme.themeCustomizations,
            customDecorations: editorData.theme.customDecorations ?? [],
          })
        } else {
          // New project — reset theme to defaults so previous project's theme doesn't bleed in
          useThemeStore.setState({
            currentTemplateId: 'editorial',
            currentTheme: 'parchment',
            themeCustomizations: {
              decorationAnimation: 'fade',
              depthEffect: 'none',
              raysEffect: 'none',
              textureEffect: 'none',
              backgroundLayersTheme: 'dark',
              backgroundScrollMode: 'fixed',
            },
            customDecorations: [],
          })
        }

        // Rehydrate content store
        const modeEntry = MODE_REGISTRY[project.mode as EditorMode]
        modeEntry.hydrateStore(editorData?.content ?? null)

        setLoadState('ready')
      } catch {
        if (!cancelled) setLoadState('error')
      }
    }

    loadProject()
    return () => { cancelled = true; setProjectId(null); setProjectName(null); setIsPublished(false) }
  }, [projectId, uid, authLoading, locale, router, setEditorMode, setProjectId, setProjectName, setIsPublished])

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [desktopActiveTab, setDesktopActiveTab] = useState<DesktopEditorTab>('sections')
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileEditorTab>('sections')

  if (loadState === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading project…
      </div>
    )
  }

  if (loadState === 'not-found') {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground text-sm">
        Project not found.
      </div>
    )
  }

  if (loadState === 'forbidden') {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground text-sm">
        You don&apos;t have access to this project.
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground text-sm">
        Failed to load project. Please try again.
      </div>
    )
  }

  const handleMobileTabChange = (tab: MobileEditorTab) => {
    setMobileActiveTab(tab)
    // Keep FloatingToolbar (desktop) in sync with mobile tab
    if (tab === 'sections' || tab === 'background' || tab === 'decorations') {
      setDesktopActiveTab(tab)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorHeader projectId={projectId} />
      <div className="flex flex-1 overflow-hidden relative  md:pb-0">
        <CanvasScrollProvider value={scrollContainerRef}>
          <Canvas scrollContainerRef={scrollContainerRef} desktopActiveTab={desktopActiveTab} />
          <SectionsSidebar activeTab={desktopActiveTab} onTabChange={setDesktopActiveTab} />

          {/* Mobile unified sheet — inside provider so it can read canvas scroll state */}
          <MobileEditorSheet
            activeTab={mobileActiveTab}
            onTabChange={handleMobileTabChange}
            scrollContainerRef={scrollContainerRef}
          />
        </CanvasScrollProvider>
      </div>

      {/* Desktop floating actions (left side panel — desktop only) */}
      <FloatingActions />

      {/* Modals */}
      <DesignCatalogModal />
      {/* Upload/manage images */}
      <MediaLibraryModal mode="manage" />
      {/* Full-screen preview — renders the real PublishedView with current store state */}
      <PreviewOverlay />
    </div>
  )
}
