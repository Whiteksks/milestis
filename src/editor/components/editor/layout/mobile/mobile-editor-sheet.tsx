"use client"

import { memo, useState, useCallback, useEffect, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { Layers, Paintbrush, Sparkles, LayoutTemplate } from "lucide-react"

import { cn } from "@/lib/utils"
import { useUiSelector } from "@/editor/lib/store"
import type { MobileEditorTab } from "@/editor/lib/editor-tabs"
import {
  SnapBottomSheet,
  useSnapBottomSheet,
} from "@/components/ui/custom/snap-bottom-sheet"

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

const PANEL_TRANSITION = {
  duration: 0.24,
  ease: [0.32, 0.72, 0, 1] as const,
} as const

const TABS: { id: MobileEditorTab; icon: React.ElementType; label: string }[] = [
  { id: "sections", icon: Layers, label: "Sections" },
  { id: "background", icon: Paintbrush, label: "Background" },
  { id: "decorations", icon: Sparkles, label: "Decor" },
  { id: "design", icon: LayoutTemplate, label: "Design" },
]

const StableSectionsSheetActions = memo(function StableSectionsSheetActions() {
  return <SectionsSheetActions />
})

const StableThemeSheetActions = memo(function StableThemeSheetActions() {
  return <ThemeSheetActions />
})

const StableDecorationsSheetActions = memo(function StableDecorationsSheetActions({
  scrollContainerRef,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}) {
  return <DecorationsSheetActions scrollContainerRef={scrollContainerRef} />
})

const StableSettingsContent = memo(function StableSettingsContent() {
  return <SettingsContent />
})

const StableThemeSettingsPanel = memo(function StableThemeSettingsPanel() {
  return <ThemeSettingsPanel />
})

const StableDecorationsSettingsPanel = memo(function StableDecorationsSettingsPanel() {
  return <DecorationsSettingsPanel />
})

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

function useManagedInert(
  ref: React.RefObject<HTMLDivElement | null>,
  isActive: boolean,
) {
  useEffect(() => {
    if (!ref.current) return

    ref.current.inert = !isActive

    if (isActive) return

    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement && ref.current.contains(activeElement)) {
      activeElement.blur()
    }
  }, [isActive, ref])
}

const MobileSheetNav = memo(function MobileSheetNav({
  activeTab,
  onTabPress,
  dragHandleProps,
  isExpanded,
}: {
  activeTab: MobileEditorTab
  onTabPress: (tab: MobileEditorTab) => void
  dragHandleProps: React.HTMLAttributes<HTMLDivElement>
  isExpanded: boolean
}) {
  return (
    <motion.div
      className="relative shrink-0"
      animate={{ opacity: isExpanded ? 1 : 0.96 }}
      transition={PANEL_TRANSITION}
    >
      <div
        {...dragHandleProps}
        className={cn(
          dragHandleProps.className,
          "absolute inset-x-0 top-0 z-10 h-8 -translate-y-2 cursor-grab active:cursor-grabbing",
        )}
        aria-label="Drag editor sheet"
      />

      <div className="pointer-events-none flex h-5 justify-center pt-2.5 pb-0">
        <motion.div
          className="w-10 h-1 rounded-full bg-foreground/20"
          animate={{ scaleX: isExpanded ? 1 : 0.94 }}
          transition={PANEL_TRANSITION}
        />
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
            <span className="text-[12px] font-medium tracking-tight">{tab.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
})

const MobileSheetQuickActions = memo(function MobileSheetQuickActions({
  activeTab,
  scrollContainerRef,
  showQuickActions,
  isFullOpen,
  quickActionsRef,
  actionsHeight,
}: {
  activeTab: MobileEditorTab
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  showQuickActions: boolean
  isFullOpen: boolean
  quickActionsRef: React.RefObject<HTMLDivElement | null>
  actionsHeight: number
}) {
  const quickActionPanels = useMemo(
    () => ({
      sections: <StableSectionsSheetActions />,
      background: <StableThemeSheetActions />,
      decorations: <StableDecorationsSheetActions scrollContainerRef={scrollContainerRef} />,
    }),
    [scrollContainerRef],
  )

  return (
    <motion.div
      ref={quickActionsRef}
      className={cn(
        "shrink-0 overflow-hidden border-t border-border/30 transform-gpu [will-change:transform,opacity]",
        !showQuickActions && "pointer-events-none",
      )}
      animate={{
        height: isFullOpen ? 0 : actionsHeight,
        opacity: showQuickActions ? 1 : 0,
        y: isFullOpen ? -8 : showQuickActions ? 0 : 10,
      }}
      transition={PANEL_TRANSITION}
    >
      <div className="h-full overflow-x-auto overscroll-x-contain no-scrollbar">
        <div className="min-w-max">{activeTab !== "design" && quickActionPanels[activeTab]}</div>
      </div>
    </motion.div>
  )
})

const MobileSheetFullContent = memo(function MobileSheetFullContent({
  activeTab,
  isFullOpen,
  fullContentRef,
}: {
  activeTab: MobileEditorTab
  isFullOpen: boolean
  fullContentRef: React.RefObject<HTMLDivElement | null>
}) {
  const fullSettingsPanels = useMemo(
    () => ({
      sections: <StableSettingsContent />,
      background: <StableThemeSettingsPanel />,
      decorations: <StableDecorationsSettingsPanel />,
    }),
    [],
  )

  return (
    <motion.div
      ref={fullContentRef}
      className={cn(
        "min-h-0 flex-1 overflow-hidden border-t border-border/30 transform-gpu [will-change:transform,opacity]",
        !isFullOpen && "pointer-events-none",
      )}
      animate={{
        opacity: isFullOpen && activeTab !== "design" ? 1 : 0,
        y: isFullOpen ? 0 : 18,
      }}
      transition={PANEL_TRANSITION}
    >
      <div className="h-full overflow-y-auto overscroll-contain">
        {activeTab !== "design" && fullSettingsPanels[activeTab]}
      </div>
    </motion.div>
  )
})

function MobileEditorSheetContent({
  activeTab,
  isFullOpen,
  snap,
  onTabPress,
  scrollContainerRef,
}: MobileEditorSheetContentProps) {
  const { dragHandleProps, snapHeights } = useSnapBottomSheet()
  const quickActionsRef = useRef<HTMLDivElement | null>(null)
  const fullContentRef = useRef<HTMLDivElement | null>(null)
  const actionsHeight = Math.max(0, (snapHeights[1] ?? 0) - (snapHeights[0] ?? 0))
  const showQuickActions = snap !== SNAP_NAV && !isFullOpen
  const isExpanded = snap !== SNAP_NAV
  const isFullContentVisible = isFullOpen && activeTab !== "design"

  useManagedInert(quickActionsRef, showQuickActions)
  useManagedInert(fullContentRef, isFullContentVisible)

  return (
    <div onPointerDown={(e) => e.stopPropagation()} className="flex h-full flex-col overflow-hidden">
      <div className="flex h-full flex-col overflow-hidden">
        <MobileSheetNav
          activeTab={activeTab}
          onTabPress={onTabPress}
          dragHandleProps={dragHandleProps}
          isExpanded={isExpanded}
        />

        <MobileSheetQuickActions
          activeTab={activeTab}
          scrollContainerRef={scrollContainerRef}
          showQuickActions={showQuickActions}
          isFullOpen={isFullOpen}
          quickActionsRef={quickActionsRef}
          actionsHeight={actionsHeight}
        />

        <MobileSheetFullContent
          activeTab={activeTab}
          isFullOpen={isFullOpen}
          fullContentRef={fullContentRef}
        />

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