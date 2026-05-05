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
const SNAP_NAV_INDEX = 0
const SNAP_ACTIONS_INDEX = 1
const SNAP_FULL_INDEX = 2
const SNAP_NAV_HEIGHT = 68
const SNAP_ACTIONS_HEIGHT = 132
const SNAP_FULL_HEIGHT_RATIO = 0.9

const CONTENT_FADE_TRANSITION = {
  duration: 0.16,
  ease: "linear",
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
  activeSnapIndex: number
  onTabPress: (tab: MobileEditorTab) => void
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

function resolveViewportHeight() {
  if (typeof window === "undefined") return 0
  return window.visualViewport?.height ?? window.innerHeight
}

function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    const syncViewportHeight = () => {
      setViewportHeight(resolveViewportHeight())
    }

    let frameId: number | null = null
    const scheduleViewportSync = () => {
      if (frameId !== null) return
      frameId = window.requestAnimationFrame(() => {
        frameId = null
        syncViewportHeight()
      })
    }

    syncViewportHeight()

    const visualViewport = window.visualViewport
    window.addEventListener("resize", scheduleViewportSync)
    window.addEventListener("orientationchange", scheduleViewportSync)
    visualViewport?.addEventListener("resize", scheduleViewportSync)

    return () => {
      window.removeEventListener("resize", scheduleViewportSync)
      window.removeEventListener("orientationchange", scheduleViewportSync)
      visualViewport?.removeEventListener("resize", scheduleViewportSync)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return viewportHeight
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
  dragHandleRef,
}: {
  activeTab: MobileEditorTab
  onTabPress: (tab: MobileEditorTab) => void
  dragHandleRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="relative shrink-0">
      <div
        ref={dragHandleRef}
        className="touch-none select-none absolute inset-x-0 top-0 z-10 h-8 -translate-y-2 cursor-grab active:cursor-grabbing"
        aria-label="Drag editor sheet"
      />

      <div className="pointer-events-none flex h-5 justify-center pt-2.5 pb-0">
        <div className="w-10 h-1 rounded-full bg-foreground/20" />
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
    </div>
  )
})

const MobileSheetQuickActions = memo(function MobileSheetQuickActions({
  activeTab,
  scrollContainerRef,
  showQuickActions,
  quickActionsRef,
  actionsHeight,
}: {
  activeTab: MobileEditorTab
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  showQuickActions: boolean
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
        "absolute inset-x-0 top-0 overflow-hidden [will-change:opacity]",
        !showQuickActions && "pointer-events-none",
      )}
      style={{ height: actionsHeight }}
      animate={{ opacity: showQuickActions ? 1 : 0 }}
      transition={CONTENT_FADE_TRANSITION}
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
        "absolute inset-0 min-h-0 overflow-hidden [will-change:opacity]",
        !isFullOpen && "pointer-events-none",
      )}
      animate={{ opacity: isFullOpen && activeTab !== "design" ? 1 : 0 }}
      transition={CONTENT_FADE_TRANSITION}
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
  activeSnapIndex,
  onTabPress,
  scrollContainerRef,
}: MobileEditorSheetContentProps) {
  const { dragHandleRef, snapHeights } = useSnapBottomSheet()
  const quickActionsRef = useRef<HTMLDivElement | null>(null)
  const fullContentRef = useRef<HTMLDivElement | null>(null)
  const actionsHeight = Math.max(0, (snapHeights[1] ?? 0) - (snapHeights[0] ?? 0))
  const showQuickActions = activeSnapIndex !== SNAP_NAV_INDEX && !isFullOpen
  const isFullContentVisible = isFullOpen && activeTab !== "design"

  useManagedInert(quickActionsRef, showQuickActions)
  useManagedInert(fullContentRef, isFullContentVisible)

  return (
    <div onPointerDown={(e) => e.stopPropagation()} className="flex h-full flex-col overflow-hidden">
      <div className="flex h-full flex-col overflow-hidden">
        <MobileSheetNav
          activeTab={activeTab}
          onTabPress={onTabPress}
          dragHandleRef={dragHandleRef}
        />

        <div className="relative min-h-0 flex-1 overflow-hidden border-t border-border/30">
          <MobileSheetQuickActions
            activeTab={activeTab}
            scrollContainerRef={scrollContainerRef}
            showQuickActions={showQuickActions}
            quickActionsRef={quickActionsRef}
            actionsHeight={actionsHeight}
          />

          <MobileSheetFullContent
            activeTab={activeTab}
            isFullOpen={isFullOpen}
            fullContentRef={fullContentRef}
          />
        </div>

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
  const [activeSnapIndex, setActiveSnapIndex] = useState(SNAP_NAV_INDEX)
  const viewportHeight = useViewportHeight()
  const snapHeights = useMemo(
    () => [
      SNAP_NAV_HEIGHT,
      SNAP_ACTIONS_HEIGHT,
      Math.max(SNAP_ACTIONS_HEIGHT, viewportHeight * SNAP_FULL_HEIGHT_RATIO),
    ],
    [viewportHeight],
  )

  const { openDesignModal, designModalSection, setSelectedDecorationId } = useUiSelector(
    (s) => ({
      openDesignModal: s.openDesignModal,
      designModalSection: s.designModalSection,
      setSelectedDecorationId: s.setSelectedDecorationId,
    }),
  )

  const handleSnapChange = useCallback((nextSnapIndex: number) => {
    setActiveSnapIndex(nextSnapIndex)
  }, [])

  const handleTabPress = useCallback(
    (tab: MobileEditorTab) => {
      // Таб "Design": сворачиваем панель и открываем модалку каталога
      if (tab === "design") {
        onTabChange("design")
        setActiveSnapIndex(SNAP_NAV_INDEX)
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
      if (activeSnapIndex === SNAP_NAV_INDEX) {
        setActiveSnapIndex(SNAP_ACTIONS_INDEX)
      } else if (activeSnapIndex === SNAP_ACTIONS_INDEX && tab === activeTab) {
        setActiveSnapIndex(SNAP_FULL_INDEX)
      }
    },
    [activeSnapIndex, activeTab, onTabChange, openDesignModal, designModalSection, setSelectedDecorationId],
  )

  const isFullOpen = activeSnapIndex === SNAP_FULL_INDEX

  return (
    <SnapBottomSheet
      open
      snapHeights={snapHeights}
      activeSnapIndex={activeSnapIndex}
      setActiveSnapIndex={handleSnapChange}
      ariaLabel="Editor controls"
      className={cn(
        "bg-card/90",
        "border border-foreground/15 border-b-0 rounded-t-2xl",
        "focus:outline-none",
      )}
    >
      <MobileEditorSheetContent
        activeTab={activeTab}
        isFullOpen={isFullOpen}
        activeSnapIndex={activeSnapIndex}
        onTabPress={handleTabPress}
        scrollContainerRef={scrollContainerRef}
      />
    </SnapBottomSheet>
  )
}