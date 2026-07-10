"use client"

import { memo, useState, useCallback, useEffect, useMemo, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Layers, Paintbrush, Sparkles, LayoutTemplate } from "lucide-react"

import { cn } from "@/lib/utils"
import { useUiSelector } from "@/editor/lib/store"
import { MODE_REGISTRY } from "@/editor/lib/modes"
import type { MobileEditorTab } from "@/editor/lib/config/editor-tabs"

import { MobileSnapSheet, type MobileSnapSheetRenderProps } from "./mobile-snap-sheet"
import { SectionsSheetActions } from "./sheet-actions/sections-sheet-actions"
import { ThemeSheetActions } from "./sheet-actions/theme-sheet-actions"
import { DecorationsSheetActions } from "./sheet-actions/decorations-sheet-actions"
import { SettingsContent } from "./settings-content"
import { ThemeSettingsPanel } from "../sidebar/theme-settings-panel"
import { DecorationsSettingsPanel } from "../sidebar/decorations-settings-panel"

// ─── Constants ────────────────────────────────────────────────────────────────

const SNAP_NAV_INDEX = 0
const SNAP_NAV_HEIGHT = 68
const SNAP_ACTIONS_HEIGHT = 132
const SNAP_FULL_HEIGHT_RATIO = 0.9
const FULL_SNAP_INDEX = 2

const CONTENT_FADE = { duration: 0.16, ease: "linear" } as const
const PANEL_SWITCH_FADE = { duration: 0.14, ease: "easeOut" } as const

const ALL_TABS: { id: MobileEditorTab; icon: React.ElementType; label: string }[] = [
  { id: "sections",     icon: Layers,        label: "Sections"   },
  { id: "background",   icon: Paintbrush,    label: "Background" },
  { id: "decorations",  icon: Sparkles,      label: "Decor"      },
  { id: "design",       icon: LayoutTemplate, label: "Design"    },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type SheetMode = "nav" | "actions" | "full"

interface MobileEditorSheetProps {
  activeTab: MobileEditorTab
  onTabChange: (tab: MobileEditorTab) => void
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveViewportHeight() {
  if (typeof window === "undefined") return 0
  return Math.round(window.visualViewport?.height ?? window.innerHeight)
}

function useViewportHeight() {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    let frameId: number | null = null

    const sync = () => {
      const nextHeight = resolveViewportHeight()
      setHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight))
    }
    const schedule = () => {
      if (frameId !== null) return
      frameId = requestAnimationFrame(() => { frameId = null; sync() })
    }

    sync()

    const vv = window.visualViewport
    window.addEventListener("resize", schedule)
    window.addEventListener("orientationchange", schedule)
    vv?.addEventListener("resize", schedule)

    return () => {
      window.removeEventListener("resize", schedule)
      window.removeEventListener("orientationchange", schedule)
      vv?.removeEventListener("resize", schedule)
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [])

  return height
}

function resolveSheetMode(snapIndex: number, fullSnapIndex: number): SheetMode {
  if (snapIndex <= SNAP_NAV_INDEX) return "nav"
  if (snapIndex >= fullSnapIndex) return "full"
  return "actions"
}

/**
 * Resolves which snap to jump to when a tab is pressed:
 * - At nav → always step up one level
 * - At actions/full and pressing the same tab → step up one level
 * - Switching to a different tab → stay at current snap
 */
function resolveNextSnapIndex(
  currentIndex: number,
  currentTab: MobileEditorTab,
  nextTab: MobileEditorTab,
  fullIndex: number,
): number {
  const stepped = Math.min(currentIndex + 1, fullIndex)
  if (currentIndex === SNAP_NAV_INDEX) return stepped
  if (currentIndex < fullIndex && nextTab === currentTab) return stepped
  return currentIndex
}

function renderActions(
  tab: MobileEditorTab,
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
): ReactNode {
  switch (tab) {
    case "sections":    return <SectionsSheetActions />
    case "background":  return <ThemeSheetActions />
    case "decorations": return <DecorationsSheetActions scrollContainerRef={scrollContainerRef} />
    default:            return null
  }
}

function renderPanel(tab: MobileEditorTab): ReactNode {
  switch (tab) {
    case "sections":    return <SettingsContent />
    case "background":  return <ThemeSettingsPanel />
    case "decorations": return <DecorationsSettingsPanel />
    default:            return null
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SheetNav = memo(function SheetNav({
  activeTab,
  onTabPress,
  dragHandleProps,
  tabs,
}: {
  activeTab: MobileEditorTab
  onTabPress: (tab: MobileEditorTab) => void
  dragHandleProps: MobileSnapSheetRenderProps["dragHandleProps"]
  tabs: typeof ALL_TABS
}) {
  return (
    // Entire nav area is the drag surface — tabs stop propagation individually
    <div
      {...dragHandleProps}
      className="relative shrink-0 select-none touch-none cursor-grab active:cursor-grabbing"
      aria-label="Editor sheet navigation"
    >
      {/* Handle pill */}
      <div className="pointer-events-none flex h-5 justify-center pt-2.5 pb-0">
        <div className="w-10 h-1 rounded-full bg-foreground/20" />
      </div>

      {/* Tab bar */}
      <div
        className="mb-2 shrink-0 grid h-12 pb-2 items-center justify-items-center"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            aria-label={tab.label}
            aria-current={activeTab === tab.id ? "page" : undefined}
            // Block the drag from starting when the finger lands on a tab button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.currentTarget.blur(); onTabPress(tab.id) }}
            className={cn(
              "touch-auto cursor-pointer w-12 h-full flex flex-col items-center justify-center gap-1 transition-colors",
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

const SheetBody = memo(function SheetBody({
  mode,
  activeTab,
  scrollContainerRef,
}: {
  mode: SheetMode
  activeTab: MobileEditorTab
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}) {
  const content = mode === "actions"
    ? renderActions(activeTab, scrollContainerRef)
    : mode === "full"
    ? renderPanel(activeTab)
    : null

  const contentClass = mode === "actions"
    ? "overflow-x-auto overscroll-x-contain no-scrollbar"
    : "overflow-y-auto overscroll-contain"

  const visible = mode !== "nav" && activeTab !== "design" && content !== null

  return (
    <motion.div
      className="min-h-0 flex-1 overflow-hidden border-t border-border/30"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={CONTENT_FADE}
    >
      <AnimatePresence initial={false} mode="wait">
        {visible ? (
          <motion.div
            key={`${mode}:${activeTab}`}
            className={cn("h-full", contentClass)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={PANEL_SWITCH_FADE}
          >
            {content}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
})

// ─── Main export ──────────────────────────────────────────────────────────────

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
      Math.max(SNAP_ACTIONS_HEIGHT, Math.round(viewportHeight * SNAP_FULL_HEIGHT_RATIO)),
    ],
    [viewportHeight],
  )

  const mode = resolveSheetMode(snapIndex, FULL_SNAP_INDEX)

  const openDesignModal = useUiSelector((state) => state.openDesignModal)
  const designModalSection = useUiSelector((state) => state.designModalSection)
  const setSelectedDecorationId = useUiSelector((state) => state.setSelectedDecorationId)
  const editorMode = useUiSelector((state) => state.editorMode)

  const tabs = useMemo(() => {
    const hideSections = MODE_REGISTRY[editorMode]?.uiConfig.hideSectionsTab ?? false
    return hideSections ? ALL_TABS.filter((t) => t.id !== 'sections') : ALL_TABS
  }, [editorMode])

  // If sections tab becomes hidden while active, redirect to background
  useEffect(() => {
    const hideSections = MODE_REGISTRY[editorMode]?.uiConfig.hideSectionsTab ?? false
    if (hideSections && activeTab === 'sections') {
      onTabChange('background')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode])

  // Collapse to nav when design tab is active (it opens a modal instead)
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
      setSnapIndex((current) => resolveNextSnapIndex(current, activeTab, tab, FULL_SNAP_INDEX))
    },
    [activeTab, designModalSection, onTabChange, openDesignModal, setSelectedDecorationId],
  )
  const handleStopPropagation = useCallback((e: React.PointerEvent) => e.stopPropagation(), [])
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
        <div
          onPointerDown={handleStopPropagation}
          className="flex h-full flex-col overflow-hidden"
        >
          <SheetNav
            activeTab={activeTab}
            onTabPress={handleTabPress}
            dragHandleProps={dragHandleProps}
            tabs={tabs}
          />
          <SheetBody
            mode={mode}
            activeTab={activeTab}
            scrollContainerRef={scrollContainerRef}
          />
          <div className="shrink-0 h-[env(safe-area-inset-bottom,0px)]" />
        </div>
      )}
    </MobileSnapSheet>
  )
}