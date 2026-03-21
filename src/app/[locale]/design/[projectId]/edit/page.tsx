'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { useShallow } from 'zustand/react/shallow'
import { db } from '@/lib/firebase'
import { useUserStore } from '@/hooks/useUserStore'
import { Canvas } from '@/editor/components/editor/canvas'
import { EditorHeader } from '@/editor/components/editor/layout/editor-header'
import { FloatingActions } from '@/editor/components/editor/layout/floating-design-buttons'
import { MediaLibraryModal } from '@/editor/components/editor/layout/Modals/media-library-modal'
import { DesignCatalogModal } from '@/editor/components/editor/layout/Modals/design-catalog-modal'
import { SectionsSidebar } from '@/editor/components/editor/layout/sidebar/sections-sidebar'
import { MobileBottomNav } from '@/editor/components/editor/layout/mobile/mobile-bottom-nav'
import { MobileDrawer } from '@/editor/components/editor/layout/mobile/mobile-drawer'
import { SettingsContent } from '@/editor/components/editor/layout/mobile/settings-content'
import { ThemeSettingsPanel } from '@/editor/components/editor/layout/sidebar/theme-settings-panel'
import { DecorationsSettingsPanel } from '@/editor/components/editor/layout/sidebar/decorations-settings-panel'
import type { DesktopEditorTab, MobileEditorTab } from '@/editor/lib/editor-tabs'
import { useUiSelector } from '@/editor/lib/store'
import { useContentStore } from '@/editor/lib/store-content'
import { useThemeStore } from '@/editor/lib/store-theme'
import { defaultPortfolioContent, defaultPortfolioVisibility } from '@/editor/lib/store-content-portfolio'
import { defaultPhotobookContent, defaultPhotobookVisibility } from '@/editor/lib/store-content-photobook'
import { CanvasScrollProvider } from '@/editor/components/editor/canvas-scroll-context'

type LoadState = 'loading' | 'ready' | 'not-found' | 'forbidden' | 'error'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const locale = params.locale as string

  const { uid, loading: userLoading } = useUserStore(
    useShallow((s) => ({ uid: s.profile?.uid ?? null, loading: s.loading }))
  )

  const setEditorMode = useUiSelector((state) => state.setEditorMode)
  const setProjectId = useUiSelector((state) => state.setProjectId)
  const setProjectName = useUiSelector((state) => state.setProjectName)
  const setIsPublished = useUiSelector((state) => state.setIsPublished)

  const [loadState, setLoadState] = useState<LoadState>('loading')

  useEffect(() => {
    if (userLoading) return
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
        if (editorData?.content) {
          if (project.mode === 'portfolio') {
            useContentStore.setState({
              sectionVisibility: editorData.content.sectionVisibility,
              sectionContent: editorData.content.sectionContent,
            })
          } else {
            useContentStore.setState({
              photobookSectionVisibility: editorData.content.sectionVisibility,
              photobookSectionContent: editorData.content.sectionContent,
            })
          }
        } else {
          // New project — reset content to defaults
          if (project.mode === 'portfolio') {
            useContentStore.setState({
              sectionVisibility: defaultPortfolioVisibility,
              sectionContent: defaultPortfolioContent,
            })
          } else {
            useContentStore.setState({
              photobookSectionVisibility: defaultPhotobookVisibility,
              photobookSectionContent: defaultPhotobookContent,
            })
          }
        }

        setLoadState('ready')
      } catch {
        if (!cancelled) setLoadState('error')
      }
    }

    loadProject()
    return () => { cancelled = true; setProjectId(null); setProjectName(null); setIsPublished(false) }
  }, [projectId, uid, userLoading, locale, router, setEditorMode, setProjectId, setProjectName, setIsPublished])

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [desktopActiveTab, setDesktopActiveTab] = useState<DesktopEditorTab>('sections')
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileEditorTab>('sections')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { openDesignModal, editorMode, designModalSection, setSelectedDecorationId } = useUiSelector((state) => ({
    openDesignModal: state.openDesignModal,
    editorMode: state.editorMode,
    designModalSection: state.designModalSection,
    setSelectedDecorationId: state.setSelectedDecorationId,
  }))

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

  const handleMobileTabChange = (tab: 'sections' | 'background' | 'decorations' | 'design') => {
    setMobileActiveTab(tab)

    // If the last action isn't Decorations, drop decoration selection/focus.
    if (tab !== 'decorations') {
      setSelectedDecorationId(null)
    }

    // Keep FloatingToolbar in sync with the last pressed mobile tab.
    if (tab === 'sections' || tab === 'background' || tab === 'decorations') {
      setDesktopActiveTab(tab)
    }

    if (tab === 'design') {
      // Map the catalog's last section to the closest FloatingToolbar tab.
      setDesktopActiveTab(designModalSection === 'backgrounds' ? 'decorations' : 'background')
      setIsDrawerOpen(false)
      // Reopen the Design Catalog on the last-used section.
      openDesignModal(designModalSection)
      return
    }

    setIsDrawerOpen(true)
  }

  const getDrawerTitle = () => {
    if (mobileActiveTab === 'sections') {
      return editorMode === 'photobook' ? 'Photobook Sections' : 'Page Sections'
    }
    if (mobileActiveTab === 'background') return 'Background'
    if (mobileActiveTab === 'decorations') return 'Decorations'
    return 'Settings'
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorHeader projectId={projectId} />
      <div className="flex flex-1 overflow-hidden relative  md:pb-0">
        <CanvasScrollProvider value={scrollContainerRef}>
          <Canvas scrollContainerRef={scrollContainerRef} desktopActiveTab={desktopActiveTab} />
          <SectionsSidebar activeTab={desktopActiveTab} onTabChange={setDesktopActiveTab} />

          {/* Mobile bottom navigation — inside provider so it can read canvas scroll state */}
          <MobileBottomNav
            activeTab={mobileActiveTab}
            onTabChange={handleMobileTabChange}
          />
        </CanvasScrollProvider>
      </div>

      {/* Desktop floating actions */}
      <FloatingActions />
      
      {/* Mobile bottom sheet */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={getDrawerTitle()}
      >
        {mobileActiveTab === 'sections' && <SettingsContent />}
        {mobileActiveTab === 'background' && <ThemeSettingsPanel />}
        {mobileActiveTab === 'decorations' && <DecorationsSettingsPanel />}
      </MobileDrawer>

      {/* Modals */}
      <DesignCatalogModal />
      {/* Upload/manage images */}
      <MediaLibraryModal mode="manage" />
    </div>
  )
}
