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
import { CanvasScrollProvider } from '@/editor/components/editor/canvas-scroll-context'

type LoadState = 'loading' | 'ready' | 'not-found' | 'forbidden' | 'error'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const locale = params.locale as string

  const { profile, loading: userLoading } = useUserStore(
    useShallow((s) => ({ profile: s.profile, loading: s.loading }))
  )

  const setEditorMode = useUiSelector((state) => state.setEditorMode)
  const setProjectId = useUiSelector((state) => state.setProjectId)

  const [loadState, setLoadState] = useState<LoadState>('loading')

  useEffect(() => {
    if (userLoading) return
    if (!profile) {
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
        if (project.ownerId !== profile!.uid) {
          setLoadState('forbidden')
          return
        }

        setEditorMode(project.mode)
        setProjectId(projectId)
        if (project.theme) {
          useThemeStore.setState({
            currentTemplateId: project.theme.currentTemplateId,
            currentTheme: project.theme.currentTheme,
            frameStyle: project.theme.frameStyle,
            themeCustomizations: project.theme.themeCustomizations,
            customDecorations: project.theme.customDecorations ?? [],
          })
        }

        // Rehydrate content store
        if (project.content) {
          if (project.mode === 'portfolio') {
            useContentStore.setState({
              sectionVisibility: project.content.sectionVisibility,
              sectionContent: project.content.sectionContent,
            })
          } else {
            useContentStore.setState({
              photobookSectionVisibility: project.content.sectionVisibility,
              photobookSectionContent: project.content.sectionContent,
            })
          }
        }

        setLoadState('ready')
      } catch {
        if (!cancelled) setLoadState('error')
      }
    }

    loadProject()
    return () => { cancelled = true; setProjectId(null) }
  }, [projectId, profile, userLoading, locale, router, setEditorMode, setProjectId])

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
