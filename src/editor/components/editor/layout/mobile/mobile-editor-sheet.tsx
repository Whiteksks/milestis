"use client"

import { memo, useState, useCallback, useEffect, useMemo, type HTMLAttributes, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Layers, Paintbrush, Sparkles, LayoutTemplate } from "lucide-react"

import { cn } from "@/lib/utils"
import { useUiSelector } from "@/editor/lib/store"
import type { MobileEditorTab } from "@/editor/lib/editor-tabs"

import { MobileSnapSheet } from "./mobile-snap-sheet"
import { SectionsSheetActions } from "./sheet-actions/sections-sheet-actions"
import { ThemeSheetActions } from "./sheet-actions/theme-sheet-actions"
import { DecorationsSheetActions } from "./sheet-actions/decorations-sheet-actions"
import { SettingsContent } from "./settings-content"
import { ThemeSettingsPanel } from "../sidebar/theme-settings-panel"
import { DecorationsSettingsPanel } from "../sidebar/decorations-settings-panel"

const SNAP_NAV_INDEX = 0
const SNAP_NAV_HEIGHT = 68
const SNAP_ACTIONS_HEIGHT = 132
const SNAP_FULL_HEIGHT_RATIO = 0.9

const CONTENT_FADE_TRANSITION = {
  duration: 0.16,
  ease: "linear",
} as const

const SETTINGS_SWITCH_FADE_TRANSITION = {
  duration: 0.14,
  ease: "easeOut",
} as const

const TABS: { id: MobileEditorTab; icon: React.ElementType; label: string }[] = [
  { id: "sections", icon: Layers, label: "Sections" },
  { id: "background", icon: Paintbrush, label: "Background" },
  { id: "decorations", icon: Sparkles, label: "Decor" },
  { id: "design", icon: LayoutTemplate, label: "Design" },
]

type MobileSheetMode = "nav" | "actions" | "full"

interface MobileEditorSheetProps {
  activeTab: MobileEditorTab
  onTabChange: (tab: MobileEditorTab) => void
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

function resolveSheetMode(snapIndex: number, fullSnapIndex: number): MobileSheetMode {
  if (snapIndex <= SNAP_NAV_INDEX) return "nav"
  if (snapIndex >= fullSnapIndex) return "full"
  return "actions"
}

function resolveNextSnapIndex(
  currentSnapIndex: number,
  currentTab: MobileEditorTab,
  nextTab: MobileEditorTab,
  fullSnapIndex: number,
) {
  const nextExpandedSnapIndex = Math.min(currentSnapIndex + 1, fullSnapIndex)

  if (currentSnapIndex === SNAP_NAV_INDEX) return nextExpandedSnapIndex
  if (currentSnapIndex < fullSnapIndex && nextTab === currentTab) return nextExpandedSnapIndex
  return currentSnapIndex
}

function renderQuickActions(
  activeTab: MobileEditorTab,
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
) {
  switch (activeTab) {
    case "sections":
      return <SectionsSheetActions />
    case "background":
      return <ThemeSheetActions />
    case "decorations":
      return <DecorationsSheetActions scrollContainerRef={scrollContainerRef} />
    default:
      return null
  }
}

function renderSettingsPanel(activeTab: MobileEditorTab) {
  switch (activeTab) {
    case "sections":
      return <SettingsContent />
    case "background":
      return <ThemeSettingsPanel />
    case "decorations":
      return <DecorationsSettingsPanel />
    default:
      return null
  }
}

const MobileSheetNav = memo(function MobileSheetNav({
  activeTab,
  onTabPress,
  dragHandleProps,
}: {
  activeTab: MobileEditorTab
  onTabPress: (tab: MobileEditorTab) => void
  dragHandleProps: HTMLAttributes<HTMLDivElement>
}) {
  return (
    <div
      className="relative shrink-0 select-none"
      aria-label="Editor sheet navigation"
    >
      <div
        {...dragHandleProps}
        aria-label="Drag editor sheet"
        className="absolute inset-x-0 top-0 z-10 h-10 -translate-y-2 touch-none cursor-grab active:cursor-grabbing"
      />

      <div className="pointer-events-none flex h-5 justify-center pt-2.5 pb-0">
        <div className="w-10 h-1 rounded-full bg-foreground/20" />
      </div>

      <div className="mb-2 grid h-12 shrink-0 grid-cols-4 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            aria-label={tab.label}
            aria-current={activeTab === tab.id ? "page" : undefined}
            onClick={(event) => {
              event.currentTarget.blur()
              onTabPress(tab.id)
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              activeTab === tab.id ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <tab.icon className="h-4 w-4" aria-hidden="true" />
            <span className="text-[12px] font-medium tracking-tight">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
})

const MobileSheetBody = memo(function MobileSheetBody({
  mode,
  activeTab,
  scrollContainerRef,
}: {
  mode: MobileSheetMode
  activeTab: MobileEditorTab
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}) {
  let content: ReactNode = null
  let contentClassName = ""

  if (mode === "actions") {
    content = renderQuickActions(activeTab, scrollContainerRef)
    contentClassName = "overflow-x-auto overscroll-x-contain no-scrollbar"
  }

  if (mode === "full") {
    content = renderSettingsPanel(activeTab)
    contentClassName = "overflow-y-auto overscroll-contain"
  }

  const hasVisibleContent = mode !== "nav" && activeTab !== "design" && content !== null

  return (
    <motion.div
      className="min-h-0 flex-1 overflow-hidden border-t border-border/30"
      initial={false}
      animate={{ opacity: hasVisibleContent ? 1 : 0 }}
      transition={CONTENT_FADE_TRANSITION}
    >
      <AnimatePresence initial={false} mode="wait">
        {hasVisibleContent ? (
          <motion.div
            key={`${mode}:${activeTab}`}
            className={cn("h-full", contentClassName)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={SETTINGS_SWITCH_FADE_TRANSITION}
          >
            {content}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
})

const MobileEditorSheetContent = memo(function MobileEditorSheetContent({
  activeTab,
  mode,
  onTabPress,
  dragHandleProps,
  scrollContainerRef,
}: {
  activeTab: MobileEditorTab
  mode: MobileSheetMode
  onTabPress: (tab: MobileEditorTab) => void
  dragHandleProps: HTMLAttributes<HTMLDivElement>
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div onPointerDown={(event) => event.stopPropagation()} className="flex h-full flex-col overflow-hidden">
      <MobileSheetNav
        activeTab={activeTab}
        onTabPress={onTabPress}
        dragHandleProps={dragHandleProps}
      />

      <MobileSheetBody
        mode={mode}
        activeTab={activeTab}
        scrollContainerRef={scrollContainerRef}
      />

      <div className="shrink-0 h-[env(safe-area-inset-bottom,0px)]" />
    </div>
  )
})

export function MobileEditorSheet({
  activeTab,
  onTabChange,
  scrollContainerRef,
}: MobileEditorSheetProps) {
  const [snapIndex, setSnapIndex] = useState(SNAP_NAV_INDEX)
  const viewportHeight = useViewportHeight()
  const snapHeights = useMemo(
    () => [
      SNAP_NAV_HEIGHT,
      SNAP_ACTIONS_HEIGHT,
      Math.max(SNAP_ACTIONS_HEIGHT, viewportHeight * SNAP_FULL_HEIGHT_RATIO),
    ],
    [viewportHeight],
  )
  const fullSnapIndex = snapHeights.length - 1

  const { openDesignModal, designModalSection, setSelectedDecorationId } = useUiSelector(
    (state) => ({
      openDesignModal: state.openDesignModal,
      designModalSection: state.designModalSection,
      setSelectedDecorationId: state.setSelectedDecorationId,
    }),
  )

  const mode = resolveSheetMode(snapIndex, fullSnapIndex)

  useEffect(() => {
    if (activeTab !== "design") return
    setSnapIndex(SNAP_NAV_INDEX)
  }, [activeTab])

  const handleTabPress = useCallback(
    (tab: MobileEditorTab) => {
      if (tab === "design") {
        onTabChange("design")
        setSnapIndex(SNAP_NAV_INDEX)
        openDesignModal(designModalSection)
        return
      }

      if (tab !== "decorations") {
        setSelectedDecorationId(null)
      }

      onTabChange(tab)
      setSnapIndex((currentSnapIndex) => resolveNextSnapIndex(currentSnapIndex, activeTab, tab, fullSnapIndex))
    },
    [activeTab, designModalSection, fullSnapIndex, onTabChange, openDesignModal, setSelectedDecorationId],
  )

  return (
    <MobileSnapSheet
      open
      snapHeights={snapHeights}
      snapIndex={snapIndex}
      onSnapIndexChange={setSnapIndex}
      ariaLabel="Editor controls"
      className={cn(
        "bg-card/90",
        "border border-foreground/15 border-b-0 rounded-t-2xl",
        "focus:outline-none",
      )}
    >
      {({ dragHandleProps }) => (
        <MobileEditorSheetContent
          activeTab={activeTab}
          mode={mode}
          onTabPress={handleTabPress}
          dragHandleProps={dragHandleProps}
          scrollContainerRef={scrollContainerRef}
        />
      )}
    </MobileSnapSheet>
  )
}