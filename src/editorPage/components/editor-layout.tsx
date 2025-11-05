"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useDeviceType } from "@/hooks/use-device-type"
import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { TopBar } from "../editor/top-bar"
import { FloatingButtons } from "../editor/floating-buttons"
import { Canvas } from "../editor/canvas"
import { RightSidebar } from "../editor/right-sidebar"
import { BottomNavigation } from "../editor/bottom-navigation"
import { FloatingToolsButton } from "../editor/floating-tools-button"
import { BlockSelectionBottomSheet } from "../editor/block-selection-bottom-sheet"
import { SettingsBottomSheet } from "../editor/settings-bottom-sheet"
import { BlockModal } from "../editor/block-modal"
import { TemplatePreviewModal } from "../editor/template-preview-modal"
import { StructureSidebar } from "../editor/structure-sidebar"
import { FloatingSettingsButton } from "../editor/floating-settings-button"

export function EditorLayout() {
  const [blocks, setBlocks] = useState<CanvasBlock[]>([])
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false)
  const [previewBlock, setPreviewBlock] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isStructureOpen, setIsStructureOpen] = useState(false)
  const { isTouchDevice } = useDeviceType()
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const addBlock = (blockType: any, mode: "replace" | "add" = "add") => {
    if (mode === "replace") {
      setBlocks([{ ...blockType, id: `block-${Date.now()}`, order: 0, children: [] }])
    } else {
      const newBlock: CanvasBlock = {
        ...blockType,
        id: `block-${Date.now()}`,
        order: blocks.length,
        children: [],
      }
      setBlocks([...blocks, newBlock])
    }
    setIsModalOpen(false)
    setIsBottomSheetOpen(false)
    setIsPreviewOpen(false)
  }

  const updateBlock = (blockId: string, updates: Partial<CanvasBlock>) => {
    setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)))
  }

  const deleteBlock = (blockId: string) => {
    setBlocks(blocks.filter((b) => b.id !== blockId))
    setSelectedBlockId(null)
  }

  const reorderBlocks = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, movedBlock)
    setBlocks(newBlocks.map((b, idx) => ({ ...b, order: idx })))
  }

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)
  const isActualMobileDevice = isTouchDevice

  const shouldHideLeftSidebar = isActualMobileDevice
  const shouldHideRightSidebar = isActualMobileDevice
  const shouldShowBottomNav = isActualMobileDevice
  const shouldShowFloatingTools = isActualMobileDevice

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar viewport={viewport} onViewportChange={setViewport} />

      <div
        className="flex flex-1 overflow-hidden relative pb-20 md:pb-0 pt-16"
        style={{ paddingBottom: shouldShowBottomNav ? "80px" : "0" }}
      >
        {!shouldHideLeftSidebar && (
          <div className="hidden md:block">
            <FloatingButtons onAddBlock={() => setIsModalOpen(true)} />
          </div>
        )}

        <div className={`flex-1 transition-all duration-300 ${selectedBlock ? 'mr-72' : 'mr-0'}`}>
            <Canvas
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onDeleteBlock={deleteBlock}
                onReorderBlocks={reorderBlocks}
                viewport={viewport}
            />
        </div>

        {!shouldHideRightSidebar && (
          <AnimatePresence>
            {selectedBlock ? (
              <RightSidebar
                block={selectedBlock}
                onUpdateBlock={updateBlock}
                onClose={() => setSelectedBlockId(null)}
              />
            ) : null}
          </AnimatePresence>
        )}

        {!shouldHideRightSidebar && (
          <>
            <FloatingSettingsButton onClick={() => setIsStructureOpen(!isStructureOpen)} visible={blocks.length > 0} />

            <StructureSidebar
              isOpen={isStructureOpen}
              onClose={() => setIsStructureOpen(false)}
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onReorderBlocks={reorderBlocks}
            />
          </>
        )}
      </div>

      <BottomNavigation onAddBlock={() => setIsBottomSheetOpen(true)} />

      {shouldShowFloatingTools && (
        <FloatingToolsButton onClick={() => setIsSettingsSheetOpen(true)} visible={selectedBlockId !== null} />
      )}

      <BlockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddBlock={addBlock} />

      <BlockSelectionBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onAddBlock={addBlock}
      />

      <SettingsBottomSheet
        isOpen={isSettingsSheetOpen}
        onClose={() => setIsSettingsSheetOpen(false)}
        block={selectedBlock}
        onUpdateBlock={updateBlock}
      />

      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        block={previewBlock}
        onApply={(mode) => {
          if (previewBlock) addBlock(previewBlock, mode)
        }}
      />
    </div>
  )
}
