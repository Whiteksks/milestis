'use client'

import { Canvas } from '@/editor/components/editor/canvas'
import { EditorHeader } from '@/editor/components/editor/layout/editor-header'
import { FloatingActions } from '@/editor/components/editor/layout/floating-design-buttons'
import { MediaLibraryModal } from '@/editor/components/editor/layout/Modals/media-library-modal'
import { DesignCatalogModal } from '@/editor/components/editor/layout/Modals/design-catalog-modal'
import { SectionsSidebar } from '@/editor/components/editor/layout/sidebar/sections-sidebar'
import { MobileBottomNav } from '@/editor/components/editor/layout/mobile/mobile-bottom-nav'
import { MobileBottomSheet } from '@/editor/components/editor/layout/mobile/mobile-bottom-sheet'
import { SettingsContent } from '@/editor/components/editor/layout/sidebar/settings-content'
import { ThemeSettingsPanel } from '@/editor/components/editor/layout/sidebar/theme-settings-panel'
import { DecorationsSettingsPanel } from '@/editor/components/editor/layout/sidebar/decorations-settings-panel'
import type { DesktopEditorTab } from '@/editor/components/editor/layout/sidebar/sections-sidebar'
import { useRef, useState } from 'react'
import { useUiSelector } from '@/editor/lib/store'
import { CanvasScrollProvider } from '@/editor/components/editor/canvas-scroll-context'

export default function EditorPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [desktopActiveTab, setDesktopActiveTab] = useState<DesktopEditorTab>('sections')
  const [mobileActiveTab, setMobileActiveTab] = useState<'sections' | 'theme' | 'decorations' | 'design'>('sections')
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const { openDesignModal, editorMode, designModalSection, setSelectedDecorationId } = useUiSelector((state) => ({
    openDesignModal: state.openDesignModal,
    editorMode: state.editorMode,
    designModalSection: state.designModalSection,
    setSelectedDecorationId: state.setSelectedDecorationId,
  }))

  const handleMobileTabChange = (tab: 'sections' | 'theme' | 'decorations' | 'design') => {
    setMobileActiveTab(tab)

    // If the last action isn't Decorations, drop decoration selection/focus.
    if (tab !== 'decorations') {
      setSelectedDecorationId(null)
    }

    // Keep FloatingToolbar in sync with the last pressed mobile tab.
    if (tab === 'sections' || tab === 'theme' || tab === 'decorations') {
      setDesktopActiveTab(tab)
    }

    if (tab === 'design') {
      // Map the catalog's last section to the closest FloatingToolbar tab.
      setDesktopActiveTab(designModalSection === 'decorations' ? 'decorations' : 'theme')
      setIsBottomSheetOpen(false)
      // Reopen the Design Catalog on the last-used section.
      openDesignModal(designModalSection)
      return
    }

    setIsBottomSheetOpen(true)
  }

  const getSheetTitle = () => {
    if (mobileActiveTab === 'sections') {
      return editorMode === 'photobook' ? 'Photobook Sections' : 'Page Sections'
    }
    if (mobileActiveTab === 'theme') return 'Theme'
    if (mobileActiveTab === 'decorations') return 'Decorations'
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
        contentPadding={mobileActiveTab === 'sections'}
      >
        {mobileActiveTab === 'sections' && <SettingsContent />}
        {mobileActiveTab === 'theme' && <ThemeSettingsPanel />}
        {mobileActiveTab === 'decorations' && <DecorationsSettingsPanel />}
      </MobileBottomSheet>

      {/* Modals */}
      <DesignCatalogModal />
      {/* Upload/manage images */}
      <MediaLibraryModal mode="manage" />
    </div>
  )
}
