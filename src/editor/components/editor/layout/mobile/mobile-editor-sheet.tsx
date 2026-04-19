"use client"

import { useState, useCallback } from "react"
import { motion, useTransform } from "framer-motion"
import { Layers, Paintbrush, Sparkles, LayoutTemplate } from "lucide-react"

import { cn } from "@/lib/utils"
import { useUiSelector } from "@/editor/lib/store"
import type { MobileEditorTab } from "@/editor/lib/editor-tabs"
import {
  SnapBottomSheet,
  useSnapBottomSheet,
  useSnapBottomSheetTransition,
} from "../../../../../components/ui/custom/snap-bottom-sheet"

import { SectionsSheetActions } from "./sheet-actions/sections-sheet-actions"
import { ThemeSheetActions } from "./sheet-actions/theme-sheet-actions"
import { DecorationsSheetActions } from "./sheet-actions/decorations-sheet-actions"
import { SettingsContent } from "./settings-content"
import { ThemeSettingsPanel } from "../sidebar/theme-settings-panel"
import { DecorationsSettingsPanel } from "../sidebar/decorations-settings-panel"

/**
 * КОНСТАНТЫ ПРИВЯЗКИ (SNAPS)
 * Snap 1 — только навигация (высота таббара + отступ)
 * Snap 2 — панель быстрых действий
 * Snap 3 — развернутая панель (92% высоты экрана)
 */
const SNAP_NAV = "68px"
const SNAP_ACTIONS = "132px"
const SNAP_FULL = 0.9
const SNAPS: (string | number)[] = [SNAP_NAV, SNAP_ACTIONS, SNAP_FULL]

const TABS: { id: MobileEditorTab; icon: React.ElementType; label: string }[] = [
  { id: "sections", icon: Layers, label: "Sections" },
  { id: "background", icon: Paintbrush, label: "Background" },
  { id: "decorations", icon: Sparkles, label: "Decor" },
  { id: "design", icon: LayoutTemplate, label: "Design" },
]

interface MobileEditorSheetProps {
  activeTab: MobileEditorTab
  onTabChange: (tab: MobileEditorTab) => void
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

interface MobileEditorSheetContentProps {
  activeTab: MobileEditorTab
  isFullOpen: boolean
  snap: string | number
  onTabPress: (tab: MobileEditorTab) => void
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

function MobileEditorSheetContent({
  activeTab,
  isFullOpen,
  snap,
  onTabPress,
  scrollContainerRef,
}: MobileEditorSheetContentProps) {
  const { dragHandleProps, snapHeights, sheetHeight } = useSnapBottomSheet()
  const actionsHeight = Math.max(0, (snapHeights[1] ?? 0) - (snapHeights[0] ?? 0))
  const quickActionsTransition = useSnapBottomSheetTransition({
    enterBetween: [0, 1],
    collapseOnUpperSnap: true,
  })
  const fullContentTransition = useSnapBottomSheetTransition({
    enterBetween: [1, 2],
  })
  const showQuickActions = snap !== SNAP_NAV && !isFullOpen
  const quickActionsHeight = useTransform(
    quickActionsTransition.visibilityProgress,
    (value) => actionsHeight * value,
  )
  const headerOpacity = useTransform(quickActionsTransition.enterProgress, [0, 1], [0.94, 1])
  const handleScale = useTransform(quickActionsTransition.enterProgress, [0, 1], [0.94, 1])
  const quickActionsOpacity = useTransform(
    quickActionsTransition.visibilityProgress,
    [0, 0.6, 1],
    [0, 0.88, 1],
  )
  const quickActionsY = useTransform(quickActionsTransition.visibilityProgress, [0, 1], [10, 0])
  const fullContentOpacity = useTransform(
    fullContentTransition.visibilityProgress,
    [0, 0.18, 0.5, 1],
    [0, 0, 0.75, 1],
  )
  const fullContentY = useTransform(fullContentTransition.visibilityProgress, [0, 1], [18, 0])

  return (
    <div onPointerDown={(e) => e.stopPropagation()} className="flex h-full flex-col overflow-hidden">
      <div className="flex h-full flex-col overflow-hidden">
        <motion.div className="relative shrink-0" style={{ opacity: headerOpacity }}>
          <div
            {...dragHandleProps}
            className={cn(
              dragHandleProps.className,
              "absolute inset-x-0 top-0 z-10 h-8 -translate-y-2 cursor-grab active:cursor-grabbing",
            )}
            aria-label="Drag editor sheet"
          />

          <div className="pointer-events-none flex h-5 justify-center pt-2.5 pb-0">
            <motion.div className="w-10 h-1 rounded-full bg-foreground/20" style={{ scaleX: handleScale }} />
          </div>

          <div className="grid h-12 shrink-0 grid-cols-4 pb-2 mb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                aria-label={tab.label}
                aria-current={activeTab === tab.id ? "page" : undefined}
                onClick={(e) => {
                  e.currentTarget.blur()
                  onTabPress(tab.id)
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors",
                  activeTab === tab.id ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <tab.icon className="w-4 h-4" aria-hidden="true" />
                <span className="text-[12px] font-medium tracking-tight">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={cn(
            "shrink-0 overflow-hidden border-t border-border/30",
            !showQuickActions && "pointer-events-none",
          )}
          style={{
            height: quickActionsHeight,
            opacity: quickActionsOpacity,
            y: quickActionsY,
          }}
          aria-hidden={!showQuickActions}
        >
          {activeTab === "sections" && <SectionsSheetActions />}
          {activeTab === "background" && <ThemeSheetActions />}
          {activeTab === "decorations" && (
            <DecorationsSheetActions scrollContainerRef={scrollContainerRef} />
          )}
        </motion.div>

        <motion.div
          className={cn(
            "min-h-0 flex-1 overflow-hidden border-t border-border/30",
            !isFullOpen && "pointer-events-none",
          )}
          style={{
            opacity: fullContentOpacity,
            y: fullContentY,
          }}
          aria-hidden={!isFullOpen || activeTab === "design"}
        >
          <div className="h-full overflow-y-auto overscroll-contain">
            {activeTab === "sections" && <SettingsContent />}
            {activeTab === "background" && <ThemeSettingsPanel />}
            {activeTab === "decorations" && <DecorationsSettingsPanel />}
          </div>
        </motion.div>

        <div className="shrink-0 h-[env(safe-area-inset-bottom,0px)]" />
      </div>
    </div>
  )
}

export function MobileEditorSheet({
  activeTab,
  onTabChange,
  scrollContainerRef,
}: MobileEditorSheetProps) {
  const [snap, setSnap] = useState<string | number>(SNAP_NAV)

  const { openDesignModal, designModalSection, setSelectedDecorationId } = useUiSelector(
    (s) => ({
      openDesignModal: s.openDesignModal,
      designModalSection: s.designModalSection,
      setSelectedDecorationId: s.setSelectedDecorationId,
    }),
  )

  const handleSnapChange = useCallback((nextSnap: string | number) => {
    setSnap(nextSnap)
  }, [])

  const handleTabPress = useCallback(
    (tab: MobileEditorTab) => {
      // Таб "Design": сворачиваем панель и открываем модалку каталога
      if (tab === "design") {
        onTabChange("design")
        setSnap(SNAP_NAV)
        openDesignModal(designModalSection)
        return
      }

      // Сбрасываем фокус с декораций при переходе на другой таб
      if (tab !== "decorations") {
        setSelectedDecorationId(null)
      }

      onTabChange(tab)

      // Логика переключения уровней (snaps):
      // 1. Из свернутого состояния -> открываем быстрые действия
      // 2. Если уже на быстрых действиях и нажат ТОТ ЖЕ таб -> открываем на весь экран
      // 3. Если на весь экран или меняем таб в процессе -> оставляем текущую высоту
      if (snap === SNAP_NAV) {
        setSnap(SNAP_ACTIONS)
      } else if (snap === SNAP_ACTIONS && tab === activeTab) {
        setSnap(SNAP_FULL)
      }
    },
    [snap, activeTab, onTabChange, openDesignModal, designModalSection, setSelectedDecorationId],
  )

  const isFullOpen = snap === SNAP_FULL

  return (
    <SnapBottomSheet
      open
      snapPoints={SNAPS}
      activeSnapPoint={snap}
      setActiveSnapPoint={handleSnapChange}
      ariaLabel="Editor controls"
      className={cn(
        "bg-card/90 backdrop-blur-sm",
        "border border-foreground/15 border-b-0 rounded-t-2xl",
        "focus:outline-none",
      )}
    >
      <MobileEditorSheetContent
        activeTab={activeTab}
        isFullOpen={isFullOpen}
        snap={snap}
        onTabPress={handleTabPress}
        scrollContainerRef={scrollContainerRef}
      />
    </SnapBottomSheet>
  )
}