'use client'

import { Canvas } from '@/editor/components/editor/canvas'
import { EditorHeader } from '@/editor/components/editor/layout/editor-header'
import { FloatingActions } from '@/editor/components/editor/layout/floating-actions'
import { MediaLibraryModal } from '@/editor/components/editor/layout/Modals/media-library-modal'
import { DesignCatalogModal } from '@/editor/components/editor/layout/Modals/design-catalog-modal'
import { SectionsSidebar } from '@/editor/components/editor/layout/sidebar/sections-sidebar'
import { MobileBottomNav } from '@/editor/components/editor/layout/mobile/mobile-bottom-nav'
import { MobileBottomSheet } from '@/editor/components/editor/layout/mobile/mobile-bottom-sheet'
import { SettingsContent } from '@/editor/components/editor/layout/sidebar/settings-content'
import type { DesktopEditorTab } from '@/editor/components/editor/layout/sidebar/sections-sidebar'
import { useRef, useState } from 'react'
import { useUiSelector } from '@/editor/lib/store'
import { CanvasScrollProvider } from '@/editor/components/editor/canvas-scroll-context'

export default function EditorPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [desktopActiveTab, setDesktopActiveTab] = useState<DesktopEditorTab>('sections')
  const [mobileActiveTab, setMobileActiveTab] = useState<'sections' | 'theme' | 'templates' | 'decorations'>('sections')
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const { openDesignModal, editorMode } = useUiSelector((state) => ({
    openDesignModal: state.openDesignModal,
    editorMode: state.editorMode,
  }))

  const handleMobileTabChange = (tab: 'sections' | 'theme' | 'templates' | 'decorations') => {
    setMobileActiveTab(tab)

    if (tab === 'templates') {
      setIsBottomSheetOpen(false)
      openDesignModal('templates')
      return
    }
    if (tab === 'theme') {
      setIsBottomSheetOpen(false)
      openDesignModal('themes')
      return
    }
    if (tab === 'decorations') {
      setIsBottomSheetOpen(false)
      openDesignModal('decorations')
      return
    }

    setIsBottomSheetOpen(true)
  }

  const getSheetTitle = () => {
    if (mobileActiveTab === 'sections') {
      return editorMode === 'photobook' ? 'Photobook Sections' : 'Page Sections'
    }
    return 'Settings'
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden relative pb-16 md:pb-0">
        <CanvasScrollProvider value={scrollContainerRef}>
          <Canvas scrollContainerRef={scrollContainerRef} desktopActiveTab={desktopActiveTab} />
          <SectionsSidebar activeTab={desktopActiveTab} onTabChange={setDesktopActiveTab} />
        </CanvasScrollProvider>
      </div>
      
      {/* Desktop floating actions */}
      <FloatingActions />
      
      {/* Mobile bottom navigation */}
      <MobileBottomNav 
        activeTab={mobileActiveTab} 
        onTabChange={handleMobileTabChange}
      />
      
      {/* Mobile bottom sheet */}
      <MobileBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title={getSheetTitle()}
      >
        {mobileActiveTab === 'sections' && <SettingsContent />}
      </MobileBottomSheet>

      {/* Modals */}
      <DesignCatalogModal />
      {/* Upload/manage images */}
      <MediaLibraryModal mode="manage" />
    </div>
  )
}
