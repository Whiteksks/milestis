'use client'

import { Canvas } from '@/editor/components/editor/canvas'
import { EditorHeader } from '@/editor/components/editor/layout/editor-header'
import { FloatingActions } from '@/editor/components/editor/layout/floating-actions'
import { TemplateSelectorModal } from '@/editor/components/editor/layout/template-selector-modal'
import { ThemeSelectorModal } from '@/editor/components/editor/layout/Modals/theme-selector-modal'
import { MediaLibraryModal } from '@/editor/components/editor/layout/Modals/media-library-modal'
import { DecorationsModal } from '@/editor/components/editor/layout/Modals/decorations-modal'
import { SectionsSidebar } from '@/editor/components/editor/layout/sidebar/sections-sidebar'
import { MobileBottomNav } from '@/editor/components/editor/layout/mobile/mobile-bottom-nav'
import { MobileBottomSheet } from '@/editor/components/editor/layout/mobile/mobile-bottom-sheet'
import { SettingsContent } from '@/editor/components/editor/layout/sidebar/settings-content'
import { useState } from 'react'
import { useUiSelector } from '@/editor/lib/store'

import { ThemeSelectorContent } from '@/editor/components/editor/layout/Modals/theme-selector-content'
import { DecorationsSelectorContent } from '@/editor/components/editor/layout/decorationEdit/decorations-selector-content'

export default function EditorPage() {
  const [mobileActiveTab, setMobileActiveTab] = useState<'sections' | 'theme' | 'templates' | 'decorations'>('sections')
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const { toggleTemplateModal, editorMode } = useUiSelector((state) => ({
    toggleTemplateModal: state.toggleTemplateModal,
    editorMode: state.editorMode,
  }))

  const handleMobileTabChange = (tab: 'sections' | 'theme' | 'templates' | 'decorations') => {
    setMobileActiveTab(tab)
    
    if (tab === 'templates') {
      toggleTemplateModal()
    } else if (tab === 'theme') {
      setIsBottomSheetOpen(true)
    } else if (tab === 'decorations') {
      setIsBottomSheetOpen(true)
    } else {
      setIsBottomSheetOpen(true)
    }
  }

  const getSheetTitle = () => {
    if (mobileActiveTab === 'sections') {
      return editorMode === 'photobook' ? 'Photobook Sections' : 'Page Sections'
    }
    if (mobileActiveTab === 'theme') return 'Choose a Theme'
    if (mobileActiveTab === 'decorations') return 'Decorations'
    return 'Settings'
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden relative pb-16 md:pb-0">
        <Canvas />
        <SectionsSidebar />
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
        {mobileActiveTab === 'theme' && (
          <div className="p-4">
            <ThemeSelectorContent onClose={() => setIsBottomSheetOpen(false)} />
          </div>
        )}
        {mobileActiveTab === 'decorations' && (
          <div className="p-4">
             <DecorationsSelectorContent onClose={() => setIsBottomSheetOpen(false)} />
          </div>
        )}
      </MobileBottomSheet>

      {/* Modals */}
      <TemplateSelectorModal />
      <ThemeSelectorModal />
      <DecorationsModal />
      {/* Upload/manage images */}
      <MediaLibraryModal mode="manage" />
    </div>
  )
}
